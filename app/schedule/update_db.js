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
    const historyLength = await this.service.bank.llen('history')
    for (let i = 0; i < historyLength; i++) {
      let history = await this.service.bank.rpop('history');
      console.log(history)
      //效能不好，想辦法喔，如果很多筆的時候會來不及寫唷
      await ctx.model.Bank.create(history);
    }
  }
}

module.exports = UpdateDB;
