import AdminJS from 'adminjs';
import AdminJSKoa from '@adminjs/koa';
import Koa from 'koa';

import provider from './admin/auth-provider.js';
import options from './admin/options.js';
import initializeDb from './db/index.js';

const port = process.env.PORT ? +process.env.PORT : 3000;

const start = async () => {
  const app = new Koa();

  await initializeDb();

  const admin = new AdminJS(options);

  app.keys = [process.env.COOKIE_SECRET];
  const router = AdminJSKoa.buildAuthenticatedRouter(
    admin,
    app,
    {
      provider,
      sessionOptions: {
        renew: true,
      },
    },
  );

  app.use(router.routes()).use(router.allowedMethods());

  app.listen(port, () => {
    console.log(`AdminJS available at http://localhost:${port}${admin.options.rootPath}`);
  });
};

start();
