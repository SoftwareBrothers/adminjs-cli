import path from 'path';
import fs from 'fs/promises';

import randomstring from 'randomstring';
import chalk from 'chalk';

import logger from '../../../utils/logger.js';
import { CreateCommandPromptsAnswers } from '../types.js';
import { BaseCommandHandler } from '../utils/BaseCommandHandler.js';

const DEFAULT_ENVS = {
  DATABASE_URL: '',
  DATABASE_DIALECT: '',
  DATABASE_NAME: '',
  DATABASE_HOST: '',
  DATABASE_USER: '',
  DATABASE_PASSWORD: '',
  COOKIE_SECRET: '',
  PORT: 3000,
};

export class EnvironmentVariablesHandler extends BaseCommandHandler<CreateCommandPromptsAnswers> {
  protected environmentVariables: Record<string, unknown>;

  constructor(options: CreateCommandPromptsAnswers) {
    super(options);

    this.environmentVariables = DEFAULT_ENVS;
    this.set('COOKIE_SECRET', randomstring.generate(32));
    this.merge(options.env);
  }

  public async run() {
    logger.info(`Preparing ${chalk.yellow('.env')} file`);
    await this.buildEnvFile();
  }

  public set(key: string, value: unknown) {
    this.environmentVariables[key] = value;
  }

  public merge(env: Record<string, unknown> = {}) {
    Object.keys(env).forEach((name) => {
      const value = env[name];

      if (value !== '') {
        this.environmentVariables[name] = value;
      }
    });
  }

  public getAll() {
    return this.environmentVariables;
  }

  protected async buildEnvFile() {
    const contents = Object.entries(this.environmentVariables).map(([key, value]) => `${key}=${value}`).join('\n');

    const destination = path.join(process.cwd(), this.options.projectName, '.env');

    await fs.writeFile(destination, contents, 'utf8');
  }
}
