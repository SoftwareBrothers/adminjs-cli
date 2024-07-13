export enum AdminJSAdapter {
  SQL = 'sql',
  TypeORM = 'typeorm',
  Sequelize = 'sequelize',
  MikroORM = 'mikroorm',
  Prisma = 'prisma',
  Objection = 'objection',
  Mongoose = 'mongoose',
}

export enum AdminJSPlugin {
  Express = 'express',
  Hapi = 'hapi',
  Koa = 'koa',
  NestJS = 'nestjs',
  Fastify = 'fastify',
}

export enum PackageManager {
  NPM = 'npm',
  Yarn = 'yarn',
  PNPM = 'pnpm',
}

export enum DatabaseDriver {
  MariaDB = 'mariadb',
  MSSQL = 'mssql',
  MySQL = 'mysql',
  PostgreSQL = 'postgres',
  Oracle = 'oracle',
  SQLite = 'sqlite',
  SQLJS = 'sqljs',
  MongoDB = 'mongodb',
}

export interface CreateCommandInput {
  projectName: string;
  adapter: AdminJSAdapter;
  plugin: AdminJSPlugin;
  packageManager: PackageManager;
  yarnPnp?: boolean;
  databaseDriver?: DatabaseDriver;
  env?: {
    DATABASE_URL: string;
    DATABASE_NAME: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_HOST: string;
  }
}
