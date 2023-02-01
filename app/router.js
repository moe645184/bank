'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/login', controller.account.login);
  router.post('/check', controller.account.check)
  router.get('/register', controller.account.register);
  router.post('/account', controller.account.account);
  router.post('/bank/deposit', controller.bank.deposit);
  router.post('/bank/transfer', controller.bank.transfer);
  router.post('/bank/withdraw', controller.bank.withdraw);
  router.get('/bank/users/:account', controller.bank.index);
  router.get('/datas/:account', controller.bank.getData);
  router.get('/bank/history/:account', controller.bank.historyPage);
};