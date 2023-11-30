import { AdminJSOptions } from 'adminjs';

import componentLoader from './component-loader.js';

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  resources: [],
  databases: [],
};

export default options;
