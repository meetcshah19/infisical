import { Knex } from "knex";
import { TableName } from "../schemas";

import { createOnUpdateTrigger, dropOnUpdateTrigger } from "../utils";
import { USER_SECRET_VALUES } from "@app/services/user-secrets/user-secrets-types";

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable(TableName.UserSecrets))) {
    await knex.schema.createTable(TableName.UserSecrets, (t) => {
      t.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
      t.uuid("userId").notNullable();
      t.foreign("userId").references("id").inTable(TableName.Users).onDelete("CASCADE");
      t.string("secretName").notNullable();
      t.uuid("orgId").notNullable();
      t.foreign("orgId").references("id").inTable(TableName.Organization).onDelete("CASCADE");
      t.text("secretValue").notNullable();
      t.text("salt").notNullable();
      t.text("iv").notNullable();
      t.text("tag").notNullable();
      t.timestamps(true, true, true);
      t.enum("secretType", USER_SECRET_VALUES, {
        useNative: true,
        enumName: "user_secret_type"
      }).notNullable();
    });

    await createOnUpdateTrigger(knex, TableName.UserSecrets);
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TableName.UserSecrets);
  await knex.schema.raw("DROP TYPE IF EXISTS user_secret_type");
  await dropOnUpdateTrigger(knex, TableName.UserSecrets);
}

