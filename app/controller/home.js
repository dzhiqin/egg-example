const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // const { id } = ctx.query;
    // ctx.body = 'get ' + id;
    await ctx.render('index.html', {
      title: '我是kkb',
    });
  }
  async user() {
    const { ctx } = this;
    // const { id } = ctx.params;
    // const { name, slogen } = await ctx.service.home.user();
    // ctx.body = {
    //   id,
    //   name,
    //   slogen,
    // };
    const result = await ctx.service.home.user();
    ctx.body = result;
  }
  async add() {
    const { ctx } = this;
    console.log('ctx', ctx.request.body);
    const { name } = ctx.request.body;
    ctx.body = {
      name,
    };
  }
  async addUser() {
    const { ctx } = this;
    const { name } = ctx.request.body;
    try {
      const result = await ctx.service.home.addUser(name);
      ctx.body = {
        code: 200,
        msg: 'success',
        data: result.insertId,
      };
    } catch (err) {
      ctx.body = {
        code: 500,
        msg: 'fail',
        data: null,
      };
    }
  }
  async editUser() {
    const { ctx } = this;
    const { id, name } = ctx.request.body;
    try {
      const result = await ctx.service.home.editUser(id, name);
      ctx.body = {
        code: 200,
        msg: 'success',
        data: result,
      };
    } catch (err) {
      ctx.body = {
        code: 500,
        msg: 'fail',
        data: null,
      };
    }
  }
  async deleteUser() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    try {
      const result = await ctx.service.home.deleteUser(id);
      ctx.body = {
        code: 200,
        msg: 'success',
        data: result,
      };
    } catch (err) {
      ctx.body = {
        code: 500,
        msg: 'fail',
        data: err,
      };
    }
  }
}

module.exports = HomeController;
