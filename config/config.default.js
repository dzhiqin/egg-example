/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
    mysql: {
      client: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'donglai2025',
        database: 'juejue-cost',
      },
      app: true,
      agent: false,
    },
    uploadDir: 'app/public/upload',
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1713401026736_3437';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ '*' ],
  };
  config.view = {
    mapping: { '.html': 'ejs' },
  };
  config.jwt = {
    secret: 'Nick',
  };
  config.multipart = {
    mode: 'file',
  };
  config.cors = {
    origin: '*',
    credentials: true,
    allowMethod: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  return {
    ...config,
    ...userConfig,
  };
};
