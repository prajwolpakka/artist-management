import { Knex } from "knex";
import { TableBuilder } from "../types/knex";

export async function up(db: Knex) {
	return await db.schema.createTable("song", (table: TableBuilder) => {
		table.increments("id").primary();
		table.string("title", 255).notNullable();
		table.string("album_name", 255).notNullable();
		table.enu("genre", ["rnb", "country", "classic", "rock", "jazz"]).notNullable();

		table.integer("artist_id").unsigned().notNullable();
		table.foreign("artist_id").references("user.id");

		table.timestamps(true, true);
	});
}

export async function down(db: Knex) {
	return await db.schema.dropTable("song");
}
