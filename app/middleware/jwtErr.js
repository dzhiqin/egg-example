module.exports = secret => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.authorization;
    let decode;
    if (token !== 'null' && token) {
      try {
        decode = ctx.app.jwt.verify(token, secret);
        console.log('decode=', decode);
        await next();
      } catch (err) {
        console.log(err);
        ctx.status = 200;
        ctx.body = {
          msg: 'token已过期',
          code: 401,
        };
        return;
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        msg: 'token不存在',
      };
      return;
    }
  };
};
