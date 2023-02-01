'use strict';

module.exports = (app) => {
  const { STRING, INTEGER, DATE, FLOAT } = app.Sequelize;

  const Bank = app.model.define('banks', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    account: STRING(20),
    move: STRING(50),
    amount: FLOAT,
    balance: FLOAT,
    date: STRING,
    created_at: DATE,
    updated_at: DATE,
  });

  return Bank;
};
