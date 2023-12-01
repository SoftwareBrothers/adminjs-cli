#! /usr/bin/env node
import chalk from 'chalk';

import { CliCommand } from './types.js';

const command = process.argv[2];

if (command === CliCommand.Create) {
  await import('./commands/create/cli.js');
} else if (command === CliCommand.Help) {
  // eslint-disable-next-line no-console
  console.log(`${chalk.underline.blue(`${chalk.yellow('@adminjs/cli')} Commands List`)}

  • ${chalk.underline('create')}                  Create an AdminJS project
  • ${chalk.underline('help')}                    List available CLI commands
  `);
} else {
  // eslint-disable-next-line no-console
  console.log(chalk.red(`Unknown command: ${command}`));
  // eslint-disable-next-line no-console
  console.log(chalk.cyan(`Run ${chalk.yellow('adminjs help')} to see available commands.`));
}
