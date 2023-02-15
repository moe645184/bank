'use strict';

const { Controller } = require('egg');

class AccountController extends Controller {

  async login(){
    const { ctx } = this;
    if (ctx.session.user){
      ctx.redirect(`/bank/users/${ ctx.session.user }`)
    } else {
      await ctx.render('login.pug');
    }
  }

  async register(){
    const { ctx } = this;
    await ctx.render('register.pug');
  }

  async account(){
    const { ctx } = this;
    const nickname = ctx.request.body.nickname;
    const account = ctx.request.body.account;
    const password = ctx.request.body.password;
    await ctx.model.Account.create({ nickname, account, password });
    ctx.redirect('/login')
  }

  async check(){
    const { ctx } = this;
    const { account, password } = ctx.request.body;
    const user = await ctx.model.Account.findOne({
      where: {
        account: account,
        password: password,
      }
    })
    if (!user){
      return ctx.body = '帳號或密碼有錯誤喔'
    }
    ctx.session.user = user.account;
    ctx.redirect(`/bank/users/${ account }`)
  }

  async logOut(){
    const { ctx } = this;
    ctx.session.user = null;
    ctx.redirect('/login')
  }

}

module.exports = AccountController;
