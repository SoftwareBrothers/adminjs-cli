import { execSync } from 'child_process';

import prompts from 'prompts';
import { unflatten } from 'flat';

import {
  adapterOptions, packageManagerOptions, pluginOptions, databaseDriversForAdapter, environmentVariablesPrompts,
} from './options.js';
import { CreateCommand } from './command.js';
import { CreateCommandInput, PackageManager } from './types.js';

const questions: prompts.PromptObject[] = [
  {
    type: 'text',
    name: 'projectName',
    message: 'Application name',
    validate: (v) => {
      if (!v.trim().length) {
        return 'Please provide a name for your project.';
      }

      const nameRegex = /[a-zA-Z_\-0-9]/gi;
      if (!nameRegex.test(v)) {
        return 'Name should consist only of letters, digits, underscores(_) or hyphens(-)';
      }

      return true;
    },
    format: (v: string) => v.trim().toLowerCase().replace(/\W+/gi, '-'),
  },
  {
    type: 'select',
    name: 'packageManager',
    message: 'Select a package manager',
    choices: packageManagerOptions,
  },
  {
    type: (prev) => {
      if (prev !== PackageManager.Yarn) {
        return null;
      }
      const isYarn1 = execSync('yarn --version', { stdio: 'pipe' }).toString().trim().startsWith('1');
      return isYarn1 ? null : 'confirm';
    },
    name: 'yarnPnp',
    message: 'Would you like to enable Yarn PnP?',
    initial: false,
  },
  {
    type: 'select',
    name: 'plugin',
    message: 'Select a plugin for your server framework',
    choices: pluginOptions,
  },
  {
    type: 'select',
    name: 'adapter',
    message: 'Select an adapter',
    choices: adapterOptions,
  },
  {
    type: 'select',
    name: 'databaseDriver',
    message: 'Select a database driver',
    choices: databaseDriversForAdapter,
  },
  ...environmentVariablesPrompts,
];

const response = (await prompts(questions)) as unknown as CreateCommandInput;
const handler = new CreateCommand(unflatten(response));
await handler.run();
