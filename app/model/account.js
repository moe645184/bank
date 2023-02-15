'use strict';

module.exports = (app) => {
  const { STRING, DATE } = app.Sequelize;

  const Account = app.model.define('accounts', {
    account: { type: STRING(20), primaryKey: true },
    nickname: STRING(10),
    password: STRING(20),
    created_at: DATE,
    updated_at: DATE,
  });

  return Account;
};
