import { TDbClient } from "@app/db";
import { TableName } from "@app/db/schemas";
import { ormify } from "src/lib/knex";

export type TUserSecretsDALFactory = ReturnType<typeof userSecretsDALFactory>;

export const userSecretsDALFactory = (db: TDbClient) => {
  const userSecretsOrm = ormify(db, TableName.UserSecrets);
  
  const findSecretsByUserIdOrgId = async (userId: string, orgId: string) => {
    return userSecretsOrm.find({
      userId,
      orgId
    });
  }

  return {
    ...userSecretsOrm,
    findSecretsByUserIdOrgId
  };
};
