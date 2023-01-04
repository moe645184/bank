'use strict';

const { Controller } = require('egg');

class BankController extends Controller {

  async deposit() {
    const { ctx } = this;
    const amount = ctx.request.body.amount;
    await ctx.service.bank.incrby('balance', amount);
    const balance = await ctx.service.bank.get('balance');
    const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });
    const move = '存款';
    const history = { move, amount, balance, date };
    await ctx.service.bank.lpush('history', history);
    await ctx.model.Bank.create({ move, amount, balance, date });
    ctx.redirect('/bank')
  }

  async withdraw() {
    const { ctx } = this;
    const amount = ctx.request.body.amount;
    const avalible = await ctx.service.bank.get('balance')
    if (amount > avalible) {
      ctx.body = '餘額不足，返回上頁';
    } else {
      await ctx.service.bank.decrby('balance', amount);
      const balance = await ctx.service.bank.get('balance');
      const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });
      const move = '提款';
      const history = { move, amount, balance, date };
      await ctx.service.bank.lpush('history', history);
      await ctx.model.Bank.create({ move, amount, balance, date });
      ctx.redirect('/bank');
    }
  }

  async index() {
    const { ctx } = this;
    const balance = await ctx.service.bank.get('balance');
    const lastTXN = await ctx.service.bank.lindex('history', 0);
    await ctx.render('index.pug', { balance, lastTXN });

    if (!lastTXN) {
      const TXNs = await ctx.model.Bank.findAll();
      for (const TXN of TXNs) {
        let move = TXN.move;
        let amount = TXN.amount;
        let balance = TXN.balance;
        let date = TXN.date;
        const history = { move, amount, balance, date };
        await ctx.service.bank.lpush('history', history);
      }
      ctx.redirect('/bank');
    }
  }

  async history() {
    const { ctx } = this;
    const histories = await ctx.service.bank.lrange('history', 0, -1);
    await ctx.render('history.pug', { histories });
  }

}

module.exports = BankController;
