import { Knex } from "knex";
import { TableBuilder } from "../types/knex";

/**
 * Create a new TABLE_NAME Table
 */
export async function up(db: Knex) {
	return await db.schema.createTable("TABLE_NAME", (table: TableBuilder) => {
		table.increments("id").primary();
		table.timestamps({ defaultToNow: true });
	});
}

/**
 * Drop the TABLE_NAME Table
 */
export async function down(db: Knex) {
	return await db.schema.dropTable("TABLE_NAME");
}
