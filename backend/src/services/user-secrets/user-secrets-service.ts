import { TUserSecretsDALFactory } from "./user-secrets-dal";
import { USER_SECRET_TYPE } from "./user-secrets-types";

type TUserSecretsServiceFactoryDep = {
  userSecretsDAL: TUserSecretsDALFactory;
};

export type TUserSecretsServiceFactory = ReturnType<typeof userSecretsServiceFactory>;

export const userSecretsServiceFactory = ({ userSecretsDAL }: TUserSecretsServiceFactoryDep) => {
  const createUserSecrets = async (
    userId: string,
    orgId: string,
    secretName: string,
    secretValue: string,
    secretType: USER_SECRET_TYPE
  ) => {
    await userSecretsDAL.create({
      userId,
      secretName,
      secretValue,
      orgId,
      secretType
    });
  };

  const getUserSecrets = async (userId: string, orgId: string) => {
    const secretsForUser = await userSecretsDAL.findSecretsByUserIdOrgId(userId, orgId);
    
    return secretsForUser;
  };

  const updateUserSecret = async (
    userId: string,
    orgId: string,
    secretId: string,
    secretName: string,
    secretValue: string,
    secretType: USER_SECRET_TYPE
  ) => {
    await userSecretsDAL.update(
      { id: secretId, userId, orgId },
      {
        secretName,
        secretValue,
        secretType
      }
    );
  };

  const deleteUserSecret = async (userId: string, orgId: string, secretId: string) => {
    await userSecretsDAL.delete({ id: secretId, userId, orgId });
  }

  return {
    createUserSecrets,
    getUserSecrets,
    updateUserSecret,
    deleteUserSecret
  };
};
