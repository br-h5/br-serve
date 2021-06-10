'use strict'

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  routerPlus: {
    enable: true,
    package: 'egg-router-plus',
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  parameters: {
    enable: true,
    package: 'egg-parameters',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
}
