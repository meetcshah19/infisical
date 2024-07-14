import { z } from "zod";
import { verifyAuth } from "@app/server/plugins/auth/verify-auth";
import { ActorType, AuthMode } from "@app/services/auth/auth-type";
import { readLimit } from "@app/server/config/rateLimiter";
import { USER_SECRET_VALUES } from "@app/services/user-secrets/user-secrets-types";
import { logger } from "@app/lib/logger";

export const registerUserSecretsRouter = async (server: FastifyZodProvider) => {
  server.route({
    method: "GET",
    url: "/",
    config: {
      rateLimit: readLimit
    },
    schema: {
      response: {
        200: z.array(
          z.object({
            id: z.string(),
            secretName: z.string(),
            secretValue: z.string(),
            secretType: z.string(),
          })
        ),
        400: z.string().describe("Only available for users")
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      if (req.auth.actor === ActorType.USER) {
        const userSecrets = await server.services.userSecrets.getUserSecrets(req.auth.userId, req.auth.orgId);
        return userSecrets;
      } 

      return "Only available for users";
    }
  });

  server.route({
    method: "POST",
    url: "/",
    config: {
      rateLimit: readLimit
    },
    schema: {
      security: [
        {
          bearerAuth: []
        }
      ],
      body: z.object({
        secretName: z.string().trim(),
        secretValue: z.string().trim(),
        secretType: z.enum(USER_SECRET_VALUES),
      }),
      response: {
        200: z.string().describe("ok"),
        400: z.string().describe("Only available for users")
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const { secretName, secretValue, secretType } = req.body;
      if (req.auth.actor === ActorType.USER) {
        await server.services.userSecrets.createUserSecrets(
          req.auth.userId,
          req.auth.orgId,
          secretName,
          secretValue,
          secretType
        );
      } else {
        return "only available for users";
      }
      return "ok";
    }
  });

  server.route({
    method: "PUT",
    url: "/:secretId",
    config: {
      rateLimit: readLimit
    },
    schema: {
      security: [
        {
          bearerAuth: []
        }
      ],
      params: z.object({
        secretId: z.string()
      }),
      body: z.object({
        secretName: z.string().trim(),
        secretValue: z.string().trim(),
        secretType: z.enum(USER_SECRET_VALUES)
      }),
      response: {
        200: z.string().describe("ok"),
        400: z.string().describe("Only available for users")
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const { secretName, secretValue, secretType } = req.body;
      logger.info(`Updating user secret with id: ${req.params.secretId}`);
      if (req.auth.actor === ActorType.USER) {
        await server.services.userSecrets.updateUserSecret(
          req.auth.userId,
          req.auth.orgId,
          req.params.secretId,
          secretName,
          secretValue,
          secretType
        );
      } else {
        return "only available for users";
      }
      return "ok";
    }
  });

  server.route({
    method: "DELETE",
    url: "/:secretId",
    config: {
      rateLimit: readLimit
    },
    schema: {
      security: [
        {
          bearerAuth: []
        }
      ],
      params: z.object({
        secretId: z.string()
      }),
      response: {
        200: z.string().describe("ok"),
        400: z.string().describe("Only available for users")
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      if (req.auth.actor === ActorType.USER) {
        await server.services.userSecrets.deleteUserSecret(req.auth.userId, req.auth.orgId, req.params.secretId);
      } else {
        return "only available for users";
      }
      return "ok";
    }
  });
};
