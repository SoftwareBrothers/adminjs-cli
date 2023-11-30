import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/typeorm';

import datasource from './datasource.js';

AdminJS.registerAdapter({ Database, Resource });

const initialize = async () => {
  await datasource.initialize();

  return { db: datasource };
};

export default initialize;
