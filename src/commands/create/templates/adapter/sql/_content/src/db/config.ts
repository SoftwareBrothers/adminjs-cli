import { DatabaseDialect } from '@adminjs/sql';

export const databaseType = process.env.DATABASE_DIALECT as DatabaseDialect;

export const connectionOptions = {
  connectionString: process.env.DATABASE_URL,
  database: process.env.DATABASE_NAME,
};
