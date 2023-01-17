const Subscription = require('egg').Subscription;

class UpdateDB extends Subscription {
  static get schedule() {
    return {
      interval: '1s',
      type: 'all',
    };
  }

  async subscribe() {
    const { ctx } = this;
    const historyLength = await this.service.bank.llen('history');
    let histories = [];
    for (let i = 0; i < historyLength; i++) {
      let history = await this.service.bank.rpop('history');
      histories.push(history);
    }
    await ctx.model.Bank.bulkCreate(histories);
  }
}

module.exports = UpdateDB;
