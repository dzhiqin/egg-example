const Controller = require('egg').Controller;

class UserController extends Controller {
  async editUserInfo() {
    const { ctx, app } = this;
    const { signature = '', avatar = '' } = ctx.request.body;
    try {

      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;
      const userInfo = await ctx.service.user.getUserByName(decode.username);
      const result = await ctx.service.user.editUserInfo({
        ...userInfo,
        signature,
        avatar,
      });
      ctx.body = {
        code: 200,
        msg: 'success',
        data: {
          id: user_id,
          signature,
          username: userInfo.username,
          avatar,
        },
      };
    } catch (err) {
      console.log('err===', err);
    }
  }
  async getUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    const userInfo = await ctx.service.user.getUserByName(decode.username);

    ctx.body = {
      code: 200,
      msg: 'success',
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature,
        avatar: userInfo.avatar,
      },
    };
  }
  async test() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    ctx.body = {
      code: 200,
      msg: 'success',
      data: {
        ...decode,
      },
    };
  }
  async login() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    const userInfo = await ctx.service.user.getUserByName(username);
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账号不存在',
        data: null,
      };
      return;
    }
    if (userInfo && password !== userInfo.password) {
      ctx.body = {
        code: 500,
        msg: '账号密码错误',
        data: null,
      };
      return;
    }
    const token = app.jwt.sign({
      id: userInfo.id,
      username: userInfo.username,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    }, app.config.jwt.secret);
    ctx.body = {
      code: 200,
      message: 'login success',
      data: {
        token,
      },
    };
  }
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: '账号密码不能为空',
        data: null,
      };
    }
    const userInfo = await ctx.service.user.getUserByName(username);
    console.log('get user', userInfo);
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账户名已被注册',
        data: null,
      };
      return;
    }
    const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';
    const result = await ctx.service.user.register({
      username,
      password,
      signature: '早日退休',
      avatar: defaultAvatar,
      createdAt: new Date(),
    });
    if (result) {
      ctx.body = {
        code: 200,
        msg: 'success',
        data: result,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: 'fail',
        data: null,
      };
    }
    return;
  }
}
module.exports = UserController;
