import { Request, Response } from "express";
import crypto from "crypto";
import { Types } from "mongoose";
import { ProbotOctokit } from "probot";
import { ForbiddenError } from "@casl/ability";

import GitAppInstallationSession from "../../ee/models/gitAppInstallationSession";
import GitAppOrganizationInstallation from "../../ee/models/gitAppOrganizationInstallation";
import GitRisks, { RiskStatus } from "../../ee/models/gitRisks";
import { Organization } from "../../models";

import { scanGithubFullRepoForSecretLeaks } from "../../queues/secret-scanning/githubScanFullRepository";
import { getSecretScanningGitAppId, getSecretScanningPrivateKey } from "../../config";
import { OrganizationNotFoundError, UnauthorizedRequestError } from "../../utils/errors";
import { validateRequest } from "../../helpers/validation";
import * as reqValidator from "../../validation/secretScanning";
import {
  OrgPermissionActions,
  OrgPermissionSubjects,
  getUserOrgPermissions
} from "../../ee/services/RoleService";
import { SecretScanningService } from "../../services";

export const createInstallationSession = async (req: Request, res: Response) => {
  const sessionId = crypto.randomBytes(16).toString("hex");
  const {
    params: { organizationId }
  } = await validateRequest(reqValidator.CreateInstallSessionv1, req);

  const organization = await Organization.findById(organizationId);
  if (!organization) {
    throw OrganizationNotFoundError({
      message: "Failed to find organization"
    });
  }

  const { permission } = await getUserOrgPermissions(req.user._id, organizationId);
  ForbiddenError.from(permission).throwUnlessCan(
    OrgPermissionActions.Create,
    OrgPermissionSubjects.SecretScanning
  );

  await GitAppInstallationSession.findByIdAndUpdate(
    organization,
    {
      organization: organization.id,
      sessionId: sessionId,
      user: new Types.ObjectId(req.user._id)
    },
    { upsert: true }
  ).lean();

  res.send({
    sessionId: sessionId
  });
};

export const linkInstallationToOrganization = async (req: Request, res: Response) => {
  const {
    body: { sessionId, installationId }
  } = await validateRequest(reqValidator.LinkInstallationToOrgv1, req);

  const installationSession = await GitAppInstallationSession.findOneAndDelete({
    sessionId: sessionId
  });
  if (!installationSession) {
    throw UnauthorizedRequestError();
  }

  const { permission } = await getUserOrgPermissions(
    req.user._id,
    installationSession.organization.toString()
  );
  ForbiddenError.from(permission).throwUnlessCan(
    OrgPermissionActions.Edit,
    OrgPermissionSubjects.SecretScanning
  );

  const installationLink = await GitAppOrganizationInstallation.findOneAndUpdate(
    {
      organizationId: installationSession.organization
    },
    {
      installationId: installationId,
      organizationId: installationSession.organization,
      user: installationSession.user
    },
    {
      upsert: true
    }
  ).lean();

  // this function will create the Git secret blind index data & salt if it doesn't exist (ie. legacy situation)
  const salt = await SecretScanningService.getGitSecretBlindIndexSalt({
    organizationId: installationSession.organization.toString()
  });

  const octokit = new ProbotOctokit({
    auth: {
      appId: await getSecretScanningGitAppId(),
      privateKey: await getSecretScanningPrivateKey(),
      installationId: installationId
    },
  });

  const {
    data: { repositories }
  } = await octokit.apps.listReposAccessibleToInstallation();
  for (const repository of repositories) {
    scanGithubFullRepoForSecretLeaks({
      organizationId: installationSession.organization.toString(),
      installationId,
      repository: { id: repository.id, fullName: repository.full_name },
      salt
    });
  }
  res.json(installationLink);
};

export const getCurrentOrganizationInstallationStatus = async (req: Request, res: Response) => {
  const { organizationId } = req.params;
  try {
    const appInstallation = await GitAppOrganizationInstallation.findOne({
      organizationId: organizationId
    }).lean();
    if (!appInstallation) {
      res.json({
        appInstallationComplete: false
      });
    }

    res.json({
      appInstallationComplete: true
    });
  } catch {
    res.json({
      appInstallationComplete: false
    });
  }
};

export const getRisksForOrganization = async (req: Request, res: Response) => {
  const {
    params: { organizationId }
  } = await validateRequest(reqValidator.GetOrgRisksv1, req);

  const { permission } = await getUserOrgPermissions(req.user._id, organizationId);
  ForbiddenError.from(permission).throwUnlessCan(
    OrgPermissionActions.Read,
    OrgPermissionSubjects.SecretScanning
  );

  const risks = await GitRisks.find({ organization: organizationId })
    .sort({ createdAt: -1 })
    .lean();
  res.json({
    risks: risks
  });
};

export const updateRiskStatus = async (req: Request, res: Response) => {
  const {
    params: { organizationId, riskId },
    body: { status }
  } = await validateRequest(reqValidator.UpdateRiskStatusv1, req);

  const { permission } = await getUserOrgPermissions(req.user._id, organizationId);
  ForbiddenError.from(permission).throwUnlessCan(
    OrgPermissionActions.Edit,
    OrgPermissionSubjects.SecretScanning
  );

  const risk = await GitRisks.findByIdAndUpdate(riskId, { status }).select("+gitSecretBlindIndex").lean();

  // if no blind index, this is a legacy situation and we need to create it
  const gitSecretBlindIndex = risk?.gitSecretBlindIndex ?? await SecretScanningService.createGitSecretBlindIndexData({ organizationId });
 
  // this function defines the status for the Git secret as this risk, 
  // even if not all the fingerprints with the same blind index have been changed
  if (gitSecretBlindIndex) {
    await SecretScanningService.updateGitSecret({
      gitSecretBlindIndex,
      organizationId,
      status: status as RiskStatus
    })
  }

  // OPTION: now we go back and update all Git risks with the same blind index 
  // this could be a popup to alert the user there are other Git risks with the same blind index but a different staus
  // await GitRisks.updateMany({ gitSecretBlindIndex }, { status }).select("+gitSecretBlindIndex").lean();

  res.json(risk);
};
