import { Database, Resource, Adapter } from '@adminjs/sql';
import AdminJS from 'adminjs';

import { connectionOptions, databaseType } from './config.js';

AdminJS.registerAdapter({ Database, Resource });

export const adapter = new Adapter(databaseType, connectionOptions);
export const db = await adapter.init();

const initialize = async () => ({ db, adapter });

export default initialize;
