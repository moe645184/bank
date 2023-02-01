'use strict';

const { Controller } = require('egg');

class BankController extends Controller {

  async deposit() {
    const { ctx } = this;
    const amount = ctx.request.body.amount;
    const account = ctx.request.body.account;
    if (amount==0){
    return ctx.redirect(`/bank/users/${account}`);
    }
    const balance = await ctx.service.bank.incrbyfloat(account + '_balance', amount);
    const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
    const move = '存款';
    const history = { move, account, amount, balance, date };
    await ctx.service.bank.lpush('history',history);
    ctx.redirect(ctx.get('referer') || '/bank');
  }

  async transfer() {
    const { ctx } = this;
    let account = ctx.request.body.account;
    const amount = ctx.request.body.amount;
    if (amount==0){
      return ctx.redirect(`/bank/users/${account}`);
    }
    const target = ctx.request.body.target;
    let move = `轉出至${target}`;
    const targetCheck = await ctx.model.Account.findOne({
      where:{
        account:target
      }
    });
    if(!targetCheck){
      return ctx.body = '欲轉入帳戶不存在'
    }
    const avalible = await ctx.service.bank.get(account + '_balance');
    if (amount > avalible) {
      return ctx.body = '餘額小於轉帳金額，請返回上頁';
    }
    const accountBalance = await ctx.service.bank.decrbyfloat(account + '_balance', amount);
    const targetBalance = await ctx.service.bank.incrbyfloat(target + '_balance', amount);
    const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
    let balance = accountBalance;
    const accountHistory = { move, account, amount, balance, date };
    move = `由${account}轉入`;
    balance = targetBalance;
    account = target;
    const targetHistory = { move, account, amount, balance, date };
    await ctx.service.bank.lpush('history',accountHistory);
    await ctx.service.bank.lpush('history',targetHistory);
    ctx.redirect(ctx.get('referer') || '/bank');
  }

  async withdraw() {
    const { ctx } = this;
    const amount = ctx.request.body.amount;
    const account = ctx.request.body.account;
    if (amount==0){
      return ctx.redirect(`/bank/users/${account}`);
    };
    const avalible = await ctx.service.bank.get(account + '_balance');
    if (amount > avalible) {
      return ctx.body = '餘額小於提款金額，請返回上頁';
    };
    const balance = await ctx.service.bank.decrbyfloat(account + '_balance', amount);
    const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
    const move = '提款';
    const history = { move, account, amount, balance, date };
    await ctx.service.bank.lpush('history',history);    
    ctx.redirect(ctx.get('referer') || '/bank');
  }

  async index() {
    const { ctx } = this;
    const account = this.ctx.params.account;
    const accountData = await ctx.model.Account.findOne({
      where:{
        account:account
      }
    });
    const nickname = accountData.nickname
    let balance = await ctx.service.bank.get( account + '_balance');
    if (!balance){
      const bank = await ctx.model.Bank.findOne({
      where: { account: account },
      order: [['createdAt', 'DESC']],
      });
      if(!bank){
        await ctx.app.redis.set(account + '_balance', 0);
      }else{
        await ctx.app.redis.set(account + '_balance', bank.balance);
      }
      balance = await ctx.service.bank.get(account + '_balance');
    }
    await ctx.render('index.pug', { account, balance, nickname });
  }

  async getData() {
    const { ctx } = this;
    const pageSize = 10;
    const page = ctx.query.page || 1;
    const account = ctx.request.params.account;
    const histories = await ctx.model.Bank.findAll({
      where: { account: account },
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['id', 'DESC']],
    });
    ctx.body = {
      histories: histories,
      page: page
    };
  };

  async historyPage() {
    const { ctx } = this;
    const account = this.ctx.params.account;
    const pageSize = 10;
    const page = ctx.query.page || 1
    const dataCount = await ctx.model.Bank.count();
    const pageCount = Math.ceil(dataCount / pageSize);
    const histories = await ctx.model.Bank.findAll({
      where: { account: account },
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['id', 'DESC']],
    });
    await ctx.render('history.pug', { histories, page, pageCount, account });
  }

}

module.exports = BankController;
