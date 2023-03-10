/* eslint valid-jsdoc: "off" */

'use strict';
require('dotenv').config()

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
    dialect: process.env.dialect,
    database: process.env.database,
    host: process.env.host,
    port: process.env.port,
    username: process.env.username,
    password: process.env.password,
    underscored: true,
    timezone: '+08:00',
  };

  config.schedule = {
    type: 'all',
    interval: '1s',
  };

  config.session = {
    key: 'SESSION_ID',
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    encrypt: true,
    renew: true,
  };

  return {
    ...config,
    ...userConfig,
  };
};
