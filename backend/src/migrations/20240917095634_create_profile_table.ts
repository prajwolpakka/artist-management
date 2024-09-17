import { Knex } from "knex";
import { TableBuilder } from "../types/knex";

export async function up(db: Knex) {
	return await db.schema.createTable("profile", (table: TableBuilder) => {
		table.increments("id").primary();
		table.string("first_name", 255).notNullable();
		table.string("last_name", 255).notNullable();
		table.string("phone", 20).notNullable();
		table.datetime("dob").notNullable();
		table.enu("gender", ["m", "f", "o"]).notNullable();
		table.string("address", 255).notNullable();

		table.integer("user_id").unsigned().notNullable();
		table.foreign("user_id").references("user.id");

		table.timestamps(true, true);
	});
}

export async function down(db: Knex) {
	return await db.schema.dropTable("profile");
}
