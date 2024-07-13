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
    if (this.options.packageManager === 'yarn') {
      await this.setupYarnrc(!!this.options.yarnPnp);
    }
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

  protected async setupYarnrc(pnpEnabled: boolean) {
    const yarnrcPath = path.join(process.cwd(), this.options.projectName, '.yarnrc.yml');
    let content = pnpEnabled ? 'nodeLinker: pnp' : 'nodeLinker: node-modules';

    // An workaround for dependencies problem
    // Ref: https://github.com/ueberdosis/tiptap/issues/3746
    if (pnpEnabled) {
      content += `
packageExtensions:
  '@tiptap/starter-kit@^2.0.0':
    peerDependencies:
      '@tiptap/pm': '^2.0.0'`;
    }

    await fs.writeFile(yarnrcPath, content, 'utf8');
  }
}
