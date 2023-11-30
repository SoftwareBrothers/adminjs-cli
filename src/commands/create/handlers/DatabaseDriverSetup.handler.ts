import path from 'path';
import fs from 'fs/promises';

import chalk from 'chalk';

import logger from '../../../utils/logger.js';
import { AdminJSAdapter, CreateCommandPromptsAnswers } from '../types.js';
import { BaseCommandHandler } from '../utils/BaseCommandHandler.js';

import { EnvironmentVariablesHandler } from './EnvironmentVariables.handler.js';

export const DB_DRIVERS_LIBRARIES = {
  postgres: 'pg' as const,
  mariadb: 'mariadb' as const,
  mysql: 'mysql2' as const,
  sqlite: 'sqlite3' as const,
  sqljs: 'sql.js' as const,
  oracle: 'oracledb' as const,
  mssql: 'mssql' as const,
  mongodb: 'mongodb' as const,
};

export const ADAPTER_TO_DB_DIALECTS_MAPPING = {
  [AdminJSAdapter.MikroORM]: {
    postgres: 'postgresql',
    mysql: 'mysql',
    mariadb: 'mariadb',
    mongodb: 'mongodb',
    sqlite: 'sqlite',
  },
  [AdminJSAdapter.Objection]: {
    postgres: 'pg',
    mysql: 'mysql',
    sqlite: 'sqlite',
  },
  [AdminJSAdapter.Prisma]: {
    postgres: 'postgresql',
    mysql: 'mysql',
    mssql: 'sqlserver',
    mongodb: 'mongodb',
    sqlite: 'sqlite',
  },
  [AdminJSAdapter.Sequelize]: {
    postgres: 'postgres',
    mysql: 'mysql',
    mariadb: 'mariadb',
    sqlite: 'sqlite',
  },
  [AdminJSAdapter.SQL]: {
    postgres: 'postgresql',
    mysql: 'mysql2',
  },
  [AdminJSAdapter.TypeORM]: {
    postgres: 'postgres',
    mariadb: 'mariadb',
    mysql: 'mysql',
    mysql2: 'mysql2',
    sqlite: 'sqlite',
    sqljs: 'sqljs',
    oracle: 'oracle',
    mssql: 'mssql',
  },
};

export interface DriverInfo {
  driverLibrary: typeof DB_DRIVERS_LIBRARIES[keyof typeof DB_DRIVERS_LIBRARIES];
  dialectName: string;
}

export class DatabaseDriverSetupHandler extends BaseCommandHandler<CreateCommandPromptsAnswers> {
  protected driverLibrary: typeof DB_DRIVERS_LIBRARIES[keyof typeof DB_DRIVERS_LIBRARIES];

  protected dialectName: string;

  private environmentVariablesHandler: EnvironmentVariablesHandler;

  constructor(options: CreateCommandPromptsAnswers, environmentVariablesHandler: EnvironmentVariablesHandler) {
    super(options);

    this.environmentVariablesHandler = environmentVariablesHandler;
  }

  public async run() {
    // @adminjs/mongoose doesn't need a driver
    if (!this.options.databaseDriver) {
      return;
    }

    logger.info(`Setting up a database driver: ${chalk.yellow(this.options.databaseDriver)}`);

    this.driverLibrary = DB_DRIVERS_LIBRARIES[this.options.databaseDriver];
    if (!this.driverLibrary) {
      throw new Error(`Unknown DB Driver: ${this.options.databaseDriver}`);
    }

    await this.addDependencyForDriver();

    const dialectsSupportedByAdapter = ADAPTER_TO_DB_DIALECTS_MAPPING[this.options.adapter];
    this.dialectName = dialectsSupportedByAdapter[this.options.databaseDriver];
    this.environmentVariablesHandler.set('DATABASE_DIALECT', this.dialectName);

    logger.info('Database driver setup complete.');
  }

  public getDriverInfo(): DriverInfo {
    return {
      driverLibrary: this.driverLibrary,
      dialectName: this.dialectName,
    };
  }

  protected async addDependencyForDriver() {
    const entry = path.join(process.cwd(), this.options.projectName, 'package.json');

    const pkgJsonFile = await fs.readFile(entry);
    const pkgJson = JSON.parse(pkgJsonFile.toString());

    pkgJson.dependencies[this.driverLibrary] = 'latest';

    const pkgJsonString = JSON.stringify(pkgJson, undefined, 2);

    await fs.writeFile(entry, pkgJsonString, 'utf8');
  }
}
