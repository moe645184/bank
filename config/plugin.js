'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  redis : {
    enable: true,
    package: 'egg-redis',
  },
  pug : {
    enable: true,
    package: 'egg-view-pug'
  },
  sequelize : {
    enable: true,
    package: 'egg-sequelize'
  },
};
