'use strict';

module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Bank = app.model.define('banks', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    move: STRING(10),
    amount: INTEGER,
    balance: INTEGER,
    date: STRING,
    created_at: DATE,
    updated_at: DATE,
  });

  return Bank;
};
