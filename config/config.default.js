/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1672125861377_8913';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.view = {
    mapping: {
      '.pug': 'pug',
    }
  };

  config.pug = {};

  config.security = {
    csrf: {
      enable: false,
    },
  };


  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  };

  config.sequelize = {
    dialect: 'mysql',
    database: 'bank',
    host: '127.0.0.1',
    port: '3307',
    username: 'test',
    password: 'test123',
    underscored: true,
    timezone: '+08:00',
  };

  return {
    ...config,
    ...userConfig,
  };
};
