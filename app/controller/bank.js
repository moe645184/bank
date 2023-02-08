'use strict';

const { Controller } = require('egg');

class BankController extends Controller {

  async deposit() {
    const { ctx } = this;
    const amount = ctx.request.body.amount;
    const account = ctx.request.body.account;
    if (!await ctx.service.bank.numberCheck(amount)){
      return ctx.body = '請輸入大於小數點後四位的數字';
    }
    const balance = await ctx.service.bank.incrby(account + '_balance', amount);
    const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
    const move = '存款';
    const history = { move, account, amount, balance, date }; 
    await ctx.service.bank.lpush('history', history);
    ctx.redirect(`/bank/users/${ account }`) 
  }
  
  async transfer() {
    const { ctx } = this;
    let account = ctx.request.body.account;
    const amount = ctx.request.body.amount;
    if (!await ctx.service.bank.numberCheck(amount)){
      return ctx.body = '請輸入大於小數點後四位的數字';
    }
    const target = ctx.request.body.target;
    let move = `轉出至${ target }`;
    const targetCheck = await ctx.model.Account.findOne({
      where: { account: target }
    });
    if (!targetCheck){
      return ctx.body = '欲轉入帳戶不存在'
    }
    let accountBalance = await ctx.service.bank.decrby(account + '_balance', amount);
    if (accountBalance < 0) {
      accountBalance = await ctx.service.bank.incrby(account + '_balance', amount);
      return ctx.body = '提款金額大於餘額，請返回上頁';
    }
    const targetBalance = await ctx.service.bank.incrby(target + '_balance', amount);
    const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
    let balance = accountBalance;
    const accountHistory = { move, account, amount, balance, date };
    move = `由${ account }轉入`;
    balance = targetBalance;
    account = target;
    const targetHistory = { move, account, amount, balance, date };
    await ctx.service.bank.lpush('history', accountHistory);
    await ctx.service.bank.lpush('history', targetHistory);
    ctx.redirect(ctx.get('referer') || '/bank');
  }

  async withdraw() {
    const { ctx } = this;
    const account = ctx.request.body.account;
    const amount = ctx.request.body.amount;
    if (!await ctx.service.bank.numberCheck(amount)){
      return ctx.body = '請輸入大於小數點後四位的數字';
    }
    let balance = await ctx.service.bank.decrby(account + '_balance', amount);
    if (balance < 0) {
      balance = await ctx.service.bank.incrby(account + '_balance', amount);
      return ctx.body = '提款金額大於餘額，請返回上頁';
    } else {
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
    const accountData = await ctx.model.Account.findOne({
      where: { account: account }
    });
    const nickname = accountData.nickname
    let balance = await ctx.service.bank.getBalance(account + '_balance');
    if (balance === null){
      const bank = await ctx.model.Bank.findOne({
        where: { account: account },
        order: [['createdAt', 'DESC']],
      });
      if (!bank){
        await ctx.app.redis.set(account + '_balance', 0);
      } else {
        await ctx.app.redis.set(account + '_balance', bank.balance);
      }
      balance = await ctx.service.bank.getBalance(account + '_balance');
    }
    await ctx.render('index.pug', { account, balance, nickname });
  }

  async getData() {
    const { ctx } = this;
    const account = this.ctx.params.account
    const pageSize = 10;
    const page = ctx.query.page || 1;
    const histories = await ctx.model.Bank.findAll({
      where: {
        account: account
      },
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
    const account = this.ctx.params.account
    const page = ctx.query.page || 1
    const histories = await ctx.model.Bank.findAll({
      where: {
        account: account
      },
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['id', 'DESC']],
    });
    const dataCount = await ctx.model.Bank.count({
      where: {
        account: account
      }
    });
    const pageCount = Math.ceil(dataCount / pageSize);
    await ctx.render('history.pug', { histories, page, pageCount, account });
  }

}

module.exports = BankController;
