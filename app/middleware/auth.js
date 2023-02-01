module.exports = () => {
  return async function auth(ctx, next) {
    if (!ctx.session.user) {
      ctx.redirect('/login');
      return;
    }
    await next();
  };
};