import { MikroORM } from '@mikro-orm/core';
import { Database, Resource } from '@adminjs/mikroorm';
import AdminJS from 'adminjs';

import config from './config.js';

AdminJS.registerAdapter({ Database, Resource });

/*
  Note: Casting "config as any" to avoid MikroORM type errors when building a generic template.
  Please import types specific to your database.
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const orm = await MikroORM.init(config as any);

const initialize = async () => ({ orm });

export default initialize;
