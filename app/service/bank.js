const Service = require('egg').Service;

class service extends Service {

  async numberCheck(amount){
    const numberRegex = /^[0-9]+([\.][0-9]{0,4})?$/;
    if (!numberRegex.test(amount) || isNaN(Number(amount)) || Number(amount) <= 0 ){
      return false
    }

    return true
  }

  async get(key) {
    let data = await this.app.redis.get(key)
    if (data === null){
      return data
    }
    if (data){
      return parse(data)
    }

    return ''
  }

  async getBalance(key) {
    let data = await this.app.redis.get(key)
    let balance = data / 10000
    if (balance || balance === 0) {
      return JSON.parse(balance)
    }

    return ''
  }

  async del(key) {
    await this.app.redis.del(key)
  }

  async lpush(key,value) {
    value = JSON.stringify(value)
    await this.app.redis.lpush(key, value)
  }

  async lindex(key,index){
    let data = await this.app.redis.lindex(key, index)
    if (data) {
      return JSON.parse(data)
    }

    return ''
  }

  async llen(key){
    let data = await this.app.redis.llen(key)
    if (data) {
      return data
    }

    return ''
  }

  async rpop(key){
    let data = await this.app.redis.rpop(key)
    if (data) {
      return JSON.parse(data)
    }

    return ''
  }

  async lrange(key,start,end){
    let data = await this.app.redis.lrange(key, start, end)
    if (data) {
      return data
    }
    
    return ''
  }

  async incrby(key, amount){
    let data = await this.app.redis.incrby(key, amount * 10000)
    return data
  }

  async decrby(key, amount){
    let data = await this.app.redis.decrby(key, amount * 10000)
    return data
    }
}

module.exports = service;
