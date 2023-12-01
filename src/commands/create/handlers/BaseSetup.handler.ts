import path from 'path';
import fs from 'fs/promises';

import chalk from 'chalk';
import { copy } from 'fs-extra/esm';

import logger from '../../../utils/logger.js';
import { CreateCommandInput } from '../types.js';
import { templatesDir } from '../utils/templates-dir.js';
import { BaseCommandHandler } from '../utils/BaseCommandHandler.js';
import { CONTENT_DIR_NAME, DOTFILES_DIR_NAME } from '../constants.js';

export class BaseSetupHandler extends BaseCommandHandler<CreateCommandInput> {
  public async run() {
    logger.info(`Setting up ${chalk.yellow(this.options.projectName)} project's base template.`);
    await this.copyBaseContents();
    await this.modifyPackageName();
    await this.copyDotFile('.eslintrc.cjs');
    await this.copyDotFile('.prettierrc');
    logger.info('Base template setup successful.');
  }

  protected async copyBaseContents() {
    const entry = path.join(templatesDir(), 'base', CONTENT_DIR_NAME);
    const destination = path.join(process.cwd(), this.options.projectName);

    await copy(
      entry,
      destination,
    );
  }

  protected async modifyPackageName() {
    const entry = path.join(process.cwd(), this.options.projectName, 'package.json');

    const pkgJsonFile = await fs.readFile(entry);
    const pkgJson = JSON.parse(pkgJsonFile.toString());

    pkgJson.name = this.options.projectName;

    const pkgJsonString = JSON.stringify(pkgJson, undefined, 2);

    await fs.writeFile(entry, pkgJsonString, 'utf8');
  }

  protected async copyDotFile(dotFileName: string) {
    const entry = path.join(templatesDir(), 'base', DOTFILES_DIR_NAME, `_${dotFileName}`);
    const destination = path.join(process.cwd(), this.options.projectName, dotFileName.replace('_', ''));

    await copy(
      entry,
      destination,
    );
  }
}
