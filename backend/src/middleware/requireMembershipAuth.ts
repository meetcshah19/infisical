import { Types } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { validateClientForMembership } from "../validation";

type req = "params" | "body" | "query";

/**
 * Validate membership with id [membershipId] and that user with id
 * [req.user._id] can modify that membership.
 * @param {Object} obj
 * @param {String[]} obj.acceptedRoles - accepted workspace roles
 * @param {String[]} obj.location - location of [workspaceId] on request (e.g. params, body) for parsing
 */
const requireMembershipAuth = ({
  acceptedRoles,
  locationMembershipId = "params"
}: {
  acceptedRoles: Array<"admin" | "member">;
  locationMembershipId: req;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { membershipId } = req[locationMembershipId];

    req.targetMembership = await validateClientForMembership({
      authData: req.authData,
      membershipId: new Types.ObjectId(membershipId),
      acceptedRoles
    });

    return next();
  };
};

export default requireMembershipAuth;
