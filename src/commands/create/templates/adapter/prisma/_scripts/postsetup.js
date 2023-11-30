/* eslint-disable no-console */
/* eslint-disable max-len */
import shell from 'child_process';
import path from 'path';

import chalk from 'chalk';

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

const postsetup = async (promptsResponse, driversInfo) => {
  const { projectName } = promptsResponse;
  const { dialectName } = driversInfo;

  const cwd = path.join(process.cwd(), projectName);

  await asyncExec(`npx prisma init --datasource-provider ${dialectName}`, { cwd, stdio: [0, 1, 2] });

  console.log(`${chalk.cyan(`${chalk.yellow('[@adminjs/prisma]')}: ${chalk.gray('prisma/schema.prisma')} has been created without models.`)}`);
  console.log(`${chalk.cyan(`${chalk.yellow('[@adminjs/prisma]')}: Please add your models to ${chalk.gray('prisma/schema.prisma')}, then run ${chalk.gray('npx prisma generate')}`)}`);
  console.log(`${chalk.cyan(`${chalk.yellow('[@adminjs/prisma]')}: The PrismaClient cannot be generated without any models inside.`)}`);
};

export default postsetup;
