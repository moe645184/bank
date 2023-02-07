'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/bank/deposit', app.controller.bank.deposit);
  router.post('/bank/withdraw', app.controller.bank.withdraw);
  router.get('/bank', app.controller.bank.login);
  router.get('/bank/users/:account', app.controller.bank.index);
  router.get('/datas', app.controller.bank.getData);
  router.get('/bank/history', app.controller.bank.historyPage);
};
