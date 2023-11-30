import Knex from 'knex';

import { BaseModel } from '../utils/BaseModel.js';
import knexConfig from '../knexfile.cjs';

const knex = BaseModel.knex(Knex.default(knexConfig[process.env.NODE_ENV ?? 'development']));

export default knex;
