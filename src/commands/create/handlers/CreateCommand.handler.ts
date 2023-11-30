import fs from 'fs/promises';
import path from 'path';

import chalk from 'chalk';

import {
  CreateCommandPromptsAnswers,
} from '../types.js';
import { BaseCommandHandler } from '../utils/BaseCommandHandler.js';
import logger from '../../../utils/logger.js';
import { asyncExec } from '../utils/async-exec.js';
import {
  displayRstInformation, displayWhatsNextTips, reportIssuesTip,
} from '../../../instructions.js';
import { displayStartTips } from '../instructions.js';

import { BaseSetupHandler } from './BaseSetup.handler.js';
import { LibrarySetupHandler, LibraryType } from './LibrarySetup.handler.js';
import { EnvironmentVariablesHandler } from './EnvironmentVariables.handler.js';
import { DatabaseDriverSetupHandler } from './DatabaseDriverSetup.handler.js';

export class CreateCommandHandler extends BaseCommandHandler<CreateCommandPromptsAnswers> {
  public async run() {
    const cwd = path.join(process.cwd(), this.options.projectName);
    const environmentVariablesHandler = new EnvironmentVariablesHandler(this.options);
    const baseSetupHandler = new BaseSetupHandler(this.options);
    const pluginSetupHandler = new LibrarySetupHandler(this.options, LibraryType.Plugin);
    const adapterSetupHandler = new LibrarySetupHandler(this.options, LibraryType.Adapter);
    const databaseDriverSetupHandler = new DatabaseDriverSetupHandler(this.options, environmentVariablesHandler);

    try {
      await baseSetupHandler.run();
      await pluginSetupHandler.run();
      await adapterSetupHandler.run();
      await databaseDriverSetupHandler.run();
      await environmentVariablesHandler.run();

      const installCommand = `${this.options.packageManager} install`;
      logger.info(`Installing dependencies: ${chalk.gray(installCommand)}`);
      await asyncExec(installCommand, { cwd, stdio: 'inherit' });

      logger.info('Running post-setup scripts.');
      const driverInfo = databaseDriverSetupHandler.getDriverInfo();
      await pluginSetupHandler.postSetup(driverInfo);
      await adapterSetupHandler.postSetup(driverInfo);

      const buildCommand = `${this.options.packageManager} run build`;
      logger.info(`Building: ${chalk.gray(buildCommand)}`);
      await asyncExec(buildCommand, { cwd, stdio: 'inherit' });

      logger.info(`Project ${chalk.yellow(this.options.projectName)} created successfully.`);

      displayStartTips(this.options.packageManager);
      displayWhatsNextTips();
      displayRstInformation();

      process.exit(0);
    } catch (error) {
      logger.error(
        // eslint-disable-next-line max-len
        `Encountered an error. Cleaning up working directory. Run command with ${chalk.yellow('DEBUG=true')} to see error details.`,
      );
      logger.info(reportIssuesTip);
      await this.cleanProjectDirectory();

      process.exit(1);
    }
  }

  protected async cleanProjectDirectory() {
    try {
      await fs.rm(path.join(process.cwd(), this.options.projectName), { recursive: true, force: true });
    } catch (err) {
      if (process.env.DEBUG === 'true') logger.debug(err);
      // Fail silently
    }
  }
}
