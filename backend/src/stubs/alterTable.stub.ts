import { SchemaBuilder, TableBuilder } from "../types/knex";

/**
 * Create a new TABLE_NAME Table
 */
export async function up(db: SchemaBuilder) {
	return await db.createTable("TABLE_NAME", (table: TableBuilder) => {
		table.increments("id").primary();
		table.timestamps({ defaultToNow: true });
	});
}

/**
 * Drop the TABLE_NAME Table
 */
export async function down(db: SchemaBuilder) {
	return await db.dropTable("TABLE_NAME");
}
