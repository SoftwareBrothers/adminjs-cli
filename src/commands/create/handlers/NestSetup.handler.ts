import chalk from 'chalk';

import { logger } from '../../../index.js';

import { LibrarySetupHandler } from './LibrarySetup.handler.js';

export class NestSetupHandler extends LibrarySetupHandler {
  public async run() {
    await super.run();
    await this.setupAdapter();
  }

  public async setupAdapter() {
    logger.info(chalk.red('--------------- IMPORTANT ---------------'));
    logger.info(`The CLI does not support adapter setup for: ${chalk.yellow('@adminjs/nestjs')}`);
    // eslint-disable-next-line max-len
    logger.info(`${chalk.yellow('@adminjs/cli')} will bootstrap a ${chalk.yellow('NestJS + AdminJS')} application, but you will have to set up the adapter manually.`);
    // eslint-disable-next-line max-len
    logger.info(`Please refer to ${chalk.underline.magenta(`https://docs.adminjs.co/installation/adapters/${this.options.adapter}`)} for instructions.`);
    logger.info(chalk.red('-----------------------------------------'));
  }
}
