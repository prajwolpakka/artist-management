import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("user", (table) => {
		table.increments("id").primary();
		table.string("email", 255).notNullable().unique();
		table.string("password", 500).notNullable();
		table.enu("role", ["super_admin", "artist_manager", "artist"]).notNullable();
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("user");
}
