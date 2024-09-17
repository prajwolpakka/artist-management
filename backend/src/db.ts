import knex, { Knex } from "knex";
import { config } from "./config";

const configuration: Knex.Config = {
	client: "mysql2",
	connection: {
		host: config.DB_HOST,
		user: config.DB_USER,
		password: config.DB_PASSWORD,
		database: config.DB_NAME,
	},
	migrations: {
		directory: "./migrations",
		extension: "ts",
		tableName: "AM_Migrations",
	},
};

export const db = knex(configuration);

export default configuration;
