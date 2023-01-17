'use strict';

const { Controller } = require('egg');

class BankController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = '泥嚎，請去http:localhost:7001/bank'
  }
}

module.exports = BankController;
