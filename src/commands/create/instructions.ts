/* eslint-disable max-len */
import chalk from 'chalk';

import logger from '../../utils/logger.js';

import { PackageManager } from './types.js';

export const startingTheAppTip = chalk.bold.magentaBright('Starting the app');
export const checkEnvTip = `Please verify if contents of ${chalk.yellow('.env')} are correct.`;
export const startTip = (packageManager: PackageManager) => `You can start the app via: ${chalk.gray(`${packageManager} run start`)}`;

export const displayStartTips = (packageManager: PackageManager) => {
  logger.info(startingTheAppTip);
  logger.info(checkEnvTip);
  logger.info(startTip(packageManager));
};
