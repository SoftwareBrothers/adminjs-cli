import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/objection';

import knex from './config.js';

AdminJS.registerAdapter({ Database, Resource });

const initialize = async () => ({ db: knex });

export default initialize;
