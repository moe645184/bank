'use strict';

const { Controller } = require('egg');

class BankController extends Controller {
  async index() {
    const { ctx } = this;
    // Get the value from Redis
    const value = await ctx.app.redis.zrange('bb',0,10);
    await ctx.render('index.pug', { value });
  }
}

module.exports = BankController;
