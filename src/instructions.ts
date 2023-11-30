/* eslint-disable max-len */
import chalk from 'chalk';

import logger from './utils/logger.js';
import {
  CLI_REPOSITORY_URL, CONTACT_URL, DEMO_URL, DISCORD_URL, DOCS_URL, MARKETPLACE_URL, RST_URL,
} from './constants.js';

export const whatsNextTip = chalk.bold.magentaBright('What\'s next?');
export const docsTip = `Read AdminJS documentation to learn how you can customize your admin panel: ${chalk.underline.magenta(DOCS_URL)}`;
export const marketplaceTip = `Create an account in ${chalk.yellow('AdminJS Marketplace')} to find free & premium addons that will help you build your dashboard: ${chalk.underline.magenta(MARKETPLACE_URL)}`;
export const demoTip = `Have a look at ${chalk.yellow('AdminJS Demo')} application: ${chalk.underline.magenta(DEMO_URL)}`;
export const discordTip = `If you need additional help, join our ${chalk.yellow('Discord')} server: ${chalk.underline.magenta(DISCORD_URL)}`;
export const reportIssuesTip = `If you encountered any issues when using this CLI tool, please report them in it's repository: ${chalk.underline.magenta(CLI_REPOSITORY_URL)}`;

export const rstIntro = chalk.bold.magentaBright('Need more assistance?');
export const rstTip1 = 'If you require hands-on assistance with building your AdminJS panel or other custom software, please contact us.';
export const rstTip2 = `${chalk.yellow('RST Software Masters')}, the creators of ${chalk.yellow('AdminJS')}, is a seasoned software development company with a 25-year history and a team of almost 200 professionals.`;
export const rstTip3 = `Visit our website: ${chalk.underline.magenta(RST_URL)}, or use a contact form to message us: ${chalk.underline.magenta(CONTACT_URL)}`;

export const displayWhatsNextTips = () => {
  logger.info(whatsNextTip);
  logger.info(docsTip);
  logger.info(marketplaceTip);
  logger.info(demoTip);
  logger.info(discordTip);
  logger.info(reportIssuesTip);
};

export const displayRstInformation = () => {
  logger.info(rstIntro);
  logger.info(rstTip1);
  logger.info(rstTip2);
  logger.info(rstTip3);
};
