import prompts from 'prompts';

import {
  AdminJSAdapter, AdminJSPlugin, DatabaseDriver, PackageManager,
} from './types.js';

export const packageManagerOptions = [
  { title: 'NPM', value: PackageManager.NPM },
  { title: 'Yarn', value: PackageManager.Yarn },
  { title: 'PNPM', value: PackageManager.PNPM },
];

export const pluginOptions = [
  { title: '@adminjs/express', value: AdminJSPlugin.Express },
  { title: '@adminjs/fastify', value: AdminJSPlugin.Fastify },
  { title: '@adminjs/koa', value: AdminJSPlugin.Koa },
  { title: '@adminjs/hapi', value: AdminJSPlugin.Hapi },
  { title: '@adminjs/nestjs', value: AdminJSPlugin.NestJS },
];

export const adapterOptions = [
  { title: '@adminjs/typeorm', value: AdminJSAdapter.TypeORM },
  { title: '@adminjs/sequelize', value: AdminJSAdapter.Sequelize },
  { title: '@adminjs/mongoose', value: AdminJSAdapter.Mongoose },
  { title: '@adminjs/prisma', value: AdminJSAdapter.Prisma },
  { title: '@adminjs/mikroorm', value: AdminJSAdapter.MikroORM },
  { title: '@adminjs/sql', value: AdminJSAdapter.SQL },
  { title: '@adminjs/objection', value: AdminJSAdapter.Objection },
];

export const allDatabaseDriverOptions = [
  { title: 'MariaDB', value: DatabaseDriver.MariaDB },
  { title: 'MSSQL', value: DatabaseDriver.MSSQL },
  { title: 'MySQL', value: DatabaseDriver.MySQL },
  { title: 'PostgreSQL', value: DatabaseDriver.PostgreSQL },
  { title: 'Oracle', value: DatabaseDriver.Oracle },
  { title: 'SQLite', value: DatabaseDriver.SQLite },
  { title: 'sql.js', value: DatabaseDriver.SQLJS },
  { title: 'MongoDB', value: DatabaseDriver.MongoDB },
];

export const databaseDriversForAdapter = (adapter: AdminJSAdapter) => {
  if (adapter === AdminJSAdapter.Mongoose) return [];

  if (adapter === AdminJSAdapter.MikroORM) {
    const supportedDrivers = [
      DatabaseDriver.MariaDB,
      DatabaseDriver.MongoDB,
      DatabaseDriver.MySQL,
      DatabaseDriver.PostgreSQL,
      DatabaseDriver.SQLite,
    ];
    return allDatabaseDriverOptions.filter(({ value }) => supportedDrivers.includes(value));
  }

  if (adapter === AdminJSAdapter.Objection) {
    const supportedDrivers = [DatabaseDriver.MySQL, DatabaseDriver.PostgreSQL, DatabaseDriver.SQLite];
    return allDatabaseDriverOptions.filter(({ value }) => supportedDrivers.includes(value));
  }

  if (adapter === AdminJSAdapter.Prisma) {
    const supportedDrivers = [
      DatabaseDriver.MongoDB,
      DatabaseDriver.MSSQL,
      DatabaseDriver.MySQL,
      DatabaseDriver.PostgreSQL,
      DatabaseDriver.SQLite,
    ];
    return allDatabaseDriverOptions.filter(({ value }) => supportedDrivers.includes(value));
  }

  if (adapter === AdminJSAdapter.Sequelize) {
    const supportedDrivers = [
      DatabaseDriver.MariaDB,
      DatabaseDriver.MySQL,
      DatabaseDriver.PostgreSQL,
      DatabaseDriver.SQLite,
    ];
    return allDatabaseDriverOptions.filter(({ value }) => supportedDrivers.includes(value));
  }

  if (adapter === AdminJSAdapter.SQL) {
    const supportedDrivers = [DatabaseDriver.MySQL, DatabaseDriver.PostgreSQL];
    return allDatabaseDriverOptions.filter(({ value }) => supportedDrivers.includes(value));
  }

  if (adapter === AdminJSAdapter.TypeORM) {
    return allDatabaseDriverOptions.filter(({ value }) => value !== DatabaseDriver.MongoDB);
  }

  return allDatabaseDriverOptions;
};

export const configurableEnvironmentVariables = [
  'DATABASE_URL',
  'DATABASE_NAME',
  'DATABASE_HOST',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
];

export const environmentVariablesPrompts: prompts.PromptObject[] = [
  {
    type: 'confirm',
    name: 'configureEnvironmentVariables',
    message: 'Would you like to configure environment variables now? You can also do that later in the .env file.',
    initial: false,
  },
  ...configurableEnvironmentVariables.map((envName) => ({
    // eslint-disable-next-line max-len
    type: (_prev: unknown, values: prompts.Answers<string>) => (values.configureEnvironmentVariables ? 'text' as const : null),
    name: `env.${envName}`,
    message: envName,
  })),
];
