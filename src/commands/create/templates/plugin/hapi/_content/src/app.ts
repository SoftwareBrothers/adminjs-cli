import AdminJSHapi, { ExtendedAdminJSOptions } from '@adminjs/hapi';
import Hapi from '@hapi/hapi';

import provider from './admin/auth-provider.js';
import options from './admin/options.js';
import initializeDb from './db/index.js';

const port = process.env.PORT ? +process.env.PORT : 3000;

const start = async () => {
  const server = Hapi.server({ port });

  await initializeDb();

  const adminOptions: ExtendedAdminJSOptions = {
    ...options,
    auth: {
      isSecure: process.env.NODE_ENV === 'production',
      cookieName: 'adminjs',
      cookiePassword: process.env.COOKIE_SECRET,
      provider,
    },
    registerInert: true,
  };

  await server.register({
    plugin: AdminJSHapi,
    options: adminOptions,
  });

  await server.start();

  console.log(
    `AdminJS available at ${server.info.uri}${adminOptions.rootPath}`,
  );
};

start();
