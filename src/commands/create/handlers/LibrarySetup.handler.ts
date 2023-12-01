import path from 'path';
import fs from 'fs/promises';

import { copy } from 'fs-extra/esm';
import chalk from 'chalk';

import logger from '../../../utils/logger.js';
import { AdminJSAdapter, AdminJSPlugin, CreateCommandInput } from '../types.js';
import { templatesDir } from '../utils/templates-dir.js';
import { BaseCommandHandler } from '../utils/BaseCommandHandler.js';
import { CONFIG_DIR_NAME, CONTENT_DIR_NAME, SCRIPTS_DIR_NAME } from '../constants.js';

import { DriverInfo } from './DatabaseDriverSetup.handler.js';

export enum LibraryType {
  Plugin = 'plugin',
  Adapter = 'adapter',
}

export interface LibrarySetupHandlerConfiguration {
  libraryName: AdminJSAdapter | AdminJSPlugin;
  type: LibraryType;
}

export class LibrarySetupHandler extends BaseCommandHandler<CreateCommandInput> {
  protected libraryType: LibraryType;

  protected libraryName: AdminJSAdapter | AdminJSPlugin;

  constructor(options: CreateCommandInput, libraryType: LibraryType) {
    super(options);

    this.libraryType = libraryType;

    if (libraryType === LibraryType.Plugin) {
      this.libraryName = this.options.plugin;
    }
    if (libraryType === LibraryType.Adapter) {
      this.libraryName = this.options.adapter;
    }
  }

  public async run() {
    logger.info(`Setting up ${chalk.yellow(`@adminjs/${this.libraryName}`)}.`);
    await this.modifyPackageContents();
    await this.copyTemplateContents();
    logger.info(`${chalk.yellow(`@adminjs/${this.libraryName}`)} setup complete.`);
  }

  public async postSetup(driversInfo: DriverInfo | null) {
    const scriptName = 'postsetup.js';

    try {
      const initImport = await import(
        path.join(templatesDir(), this.libraryType, this.libraryName, SCRIPTS_DIR_NAME, scriptName),
      );

      if (initImport?.default) {
        logger.info(`Running ${chalk.yellow(scriptName)} of ${chalk.yellow(`@adminjs/${this.libraryName}`)}.`);
        await initImport.default(this.options, driversInfo);
        logger.info(`${chalk.yellow(scriptName)} of ${chalk.yellow(`@adminjs/${this.libraryName}`)} finished.`);
      }
    } catch (error) {
      // Do nothing, not all plugins/adapters will have an init script
      if (process.env.DEBUG === 'true') logger.debug(error);
    }
  }

  protected async getJsonConfigFile(file: string) {
    const entry = path.join(templatesDir(), this.libraryType, this.libraryName, CONFIG_DIR_NAME, file);
    const jsonFile = await fs.readFile(entry);
    const json = JSON.parse(jsonFile.toString());

    return json;
  }

  protected async modifyPackageContents() {
    const entry = path.join(process.cwd(), this.options.projectName, 'package.json');

    const pkgJsonFile = await fs.readFile(entry);
    let pkgJson = JSON.parse(pkgJsonFile.toString());

    const dependencies = await this.getJsonConfigFile('dependencies.json');
    const devDependencies = await this.getJsonConfigFile('devDependencies.json');
    const scripts = await this.getJsonConfigFile('scripts.json');
    const customConfig = await this.getJsonConfigFile('custom.json');

    pkgJson.dependencies = {
      ...pkgJson.dependencies,
      ...dependencies,
    };
    pkgJson.devDependencies = {
      ...pkgJson.devDependencies,
      ...devDependencies,
    };
    pkgJson.scripts = {
      ...pkgJson.scripts,
      ...scripts,
    };
    pkgJson = {
      ...pkgJson,
      ...customConfig,
    };

    const pkgJsonString = JSON.stringify(pkgJson, undefined, 2);

    fs.writeFile(entry, pkgJsonString, 'utf8');
  }

  protected async copyTemplateContents() {
    const entry = path.join(templatesDir(), this.libraryType, this.libraryName, CONTENT_DIR_NAME);
    const destination = path.join(process.cwd(), this.options.projectName);

    await copy(
      entry,
      destination,
    );
  }
}
