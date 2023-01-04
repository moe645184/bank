'use strict';

module.exports = {
// 在執行資料庫升级時調用的函數，創建 users 表
up: async (queryInterface, Sequelize) => {
const { INTEGER, DATE, STRING } = Sequelize;
await queryInterface.createTable('banks', {
id: { type: INTEGER, primaryKey: true, autoIncrement: true },
move: STRING(10),
amount: INTEGER,
balance: INTEGER,
date: STRING,
created_at: DATE,
updated_at: DATE,
});
},
// 在執行資料庫降級時，刪除 bank 表
down: async (queryInterface) => {
await queryInterface.dropTable('banks');
    },
};