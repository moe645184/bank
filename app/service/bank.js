const Service = require('egg').Service;

class service extends Service {

  async get(key) {
    let data = await this.app.redis.get(key)
    if (data) {
      return JSON.parse(data)
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

  async incrbyfloat(key, amount){
    let data = await this.app.redis.incrbyfloat(key, amount)
    if (data){
      return JSON.parse(data)
    }
    return ''
  }

  async decrbyfloat(key, amount){
    let data = await this.app.redis.incrbyfloat(key, -amount)
    if (data){
      return JSON.parse(data)
    }
    return ''
  }

}

module.exports = service;
