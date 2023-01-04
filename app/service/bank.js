const Service = require('egg').Service;

class service extends Service {

  async get(key) {
    let data = await this.app.redis.get(key)
    if (data) {
      return JSON.parse(data)
    }
    return ''
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

  async lrange(key,start,end){
    let data = await this.app.redis.lrange(key, start, end)
    if (data) {
      return data
    }
    return ''
  }

  async incrby(key, amount){
    let data = await this.app.redis.incrby(key, amount)
    if (data){
      return JSON.parse(data)
    }
    return ''
  }

  async decrby(key, amount){
    let data = await this.app.redis.decrby(key, amount)
    if (data){
      return JSON.parse(data)
    }
    return ''
  }

}

module.exports = service;
