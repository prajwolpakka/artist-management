import { Knex } from "knex";
import { TableBuilder } from "../types/knex";

export async function up(db: Knex) {
	return await db.schema.createTable("artist", (table: TableBuilder) => {
		table.increments("id").primary();
		table.string("name", 255).notNullable();
		table.datetime("dob").notNullable();
		table.enu("gender", ["m", "f", "o"]).notNullable();
		table.string("address", 255).notNullable();
		table.integer("first_release_year").notNullable().checkBetween([1900, 9999]);
		table.integer("no_of_albums_released").notNullable();

		table.integer("user_id").unsigned().notNullable();
		table.foreign("user_id").references("user.id");

		table.timestamps(true, true);
	});
}

export async function down(db: Knex) {
	return await db.schema.dropTable("artist");
}
