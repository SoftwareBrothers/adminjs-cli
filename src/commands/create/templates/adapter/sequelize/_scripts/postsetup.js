import fs from 'fs/promises';
import path from 'path';
import shell from 'child_process';

const asyncExec = (command, opts) => new Promise((resolve, reject) => {
  setTimeout(() => {
    try {
      const result = shell.execSync(command, opts);

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
});

const sequelizerc = `const path = require('path');

module.exports = {
  'config': path.resolve('sequelize.json'),
  'models-path': path.resolve('src', 'db', 'models'),
  'seeders-path': path.resolve('src', 'db', 'models'),
  'migrations-path': path.resolve('src', 'db', 'models')
};
`;

const pgConfig = `import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: process.env.DATABASE_DIALECT as any });

export default sequelize`;
const sqliteConfig = pgConfig;
const otherConfig = `import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  { host: process.env.DATABASE_HOST, dialect: process.env.DATABASE_DIALECT as any },
);

export default sequelize`;

const postsetup = async (promptsResponse, driversInfo) => {
  const { projectName } = promptsResponse;
  const { dialectName } = driversInfo;

  const cwd = path.join(process.cwd(), projectName);

  let config = '';
  if (dialectName === 'postgres') config = pgConfig;
  else if (dialectName === 'sqlite') config = sqliteConfig;
  else {
    config = otherConfig;
  }

  const configPath = path.join(cwd, './src/db/config.ts');
  await fs.writeFile(configPath, config, 'utf8');
  const sequelizercPath = path.join(cwd, './.sequelizerc');
  await fs.writeFile(sequelizercPath, sequelizerc, 'utf8');

  await asyncExec('npx sequelize init', {
    cwd,
    stdio: [0, 1, 2],
  });
};

export default postsetup;
