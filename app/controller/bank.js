'use strict';

const { Controller } = require('egg');

class BankController extends Controller {

  async login(){
    const { ctx } = this;
    await ctx.render('login.pug');
  }

  async deposit() {
    const { ctx } = this;
    const account = ctx.request.body.account; 
    const amount = ctx.request.body.amount;
    if (isNaN(Number(account)) || Number(account) <= 0 ){
      return ctx.body = `<script>alert("請輸入大於0的數字，請返回上頁");</script>`;
    }
    const balance = await ctx.service.bank.incrbyfloat(account + '_balance', amount);
    const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
    const move = '存款';
    const history = { move, account, amount, balance, date }; 
    await ctx.service.bank.lpush('history', history);
    ctx.redirect(`/bank/users/${ account }`) 
  }

  async withdraw() {
    const { ctx } = this;
    const account = ctx.request.body.account;
    const amount = ctx.request.body.amount;
    if (isNaN(Number(account)) || Number(account) <= 0 ){
      return ctx.body = `<script>alert("請輸入大於0的數字，請返回上頁");</script>`;
    }
    const avalible = await ctx.service.bank.get(account + '_balance');
    if (amount > avalible) {
      ctx.body = `<script>alert("餘額小於提款金額，請返回上頁");</script>`;
    } else {
      const balance = await ctx.service.bank.decrbyfloat(account + '_balance', amount);
      const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
      const move = '提款';
      const history = { move, account, amount, balance, date }; 
      await ctx.service.bank.lpush('history', history);
      ctx.redirect(`/bank/users/${ account }`) 
    }
  }

  async index() {
    const { ctx } = this;
    const account = this.ctx.params.account;
    let balance = await ctx.service.bank.get(account + '_balance');
    if (!balance){
      const bank = await ctx.model.Bank.findOne({
        where: { account: account },
        order: [['createdAt', 'DESC']],
      });
      if(!bank){
        await ctx.app.redis.set(account + '_balance', 0);
      } else {
        await ctx.app.redis.set(account + '_balance', bank.balance);
      }
      balance = await ctx.service.bank.get(account + '_balance');
    }
    await ctx.render('index.pug', { account, balance });
  }

  async getData() {
    const { ctx } = this;
    const pageSize = 10;
    const page = ctx.query.page || 1;
    const histories = await ctx.model.Bank.findAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['id', 'DESC']],
    });
    ctx.body = {
      histories: histories,
      page: page
    };
  }

  async historyPage() {
    const { ctx } = this;
    const pageSize = 10;
    const page = ctx.query.page || 1
    const dataCount = await ctx.model.Bank.count();
    const pageCount = Math.ceil(dataCount / pageSize);
    const histories = await ctx.model.Bank.findAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['id', 'DESC']],
    });
    await ctx.render('history.pug', { histories, page, pageCount });
  }

}

module.exports = BankController;
