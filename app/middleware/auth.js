module.exports = () => {
  return async function auth(ctx, next) {
    const account = ctx.params.account;
    if (!ctx.session.user || ctx.session.user !== account){
      return ctx.redirect('/login');
    };
    await next();
  };
};
