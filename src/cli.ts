#! /usr/bin/env node

import { CliCommand } from './types.js';

const command = process.argv[2];

if (command === CliCommand.Create) {
  await import('./commands/create/cli.js');
} else {
  console.log('unknown command', command);
}
