const moment = require('moment');
const Controller = require('egg').Controller;
class BillController extends Controller {
  async monthData() {
    const { ctx, app } = this;
    const { month } = ctx.query;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;
    const user_id = decode.id;
    if (!month) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
    }
    const startDate = moment(month).startOf('month').format('YYYY-MM-DD');
    const endDate = moment(month).endOf('month').format('YYYY-MM-DD');
    try {
      let list = await ctx.service.bill.list(user_id);
      list = list.filter(item => {
        return moment(item.date, 'YYYY-MM-DD').isBetween(startDate, endDate, undefined, '[]');
      });
      const totalIncome = list.reduce((curr, item) => {
        if (item.pay_type === 2) {
          curr += Number(item.amount);
        }
        return curr;
      }, 0);
      const totalExpanse = list.reduce((curr, item) => {
        if (item.pay_type === 1) {
          curr += Number(item.amount);
        }
        return curr;
      }, 0);
      const listMap = list.reduce((curr, item) => {
        const itemTypeId = item.type_id;
        if (curr.length && curr.findIndex(i => i.type_id === itemTypeId) > -1) {
          const index = curr.findIndex(i => i.type_id === itemTypeId);
          curr[index].amount += Number(item.amount);
        }
        if (curr.length && curr.findIndex(i => i.type_id === itemTypeId) === -1) {
          curr.push({
            pay_type: item.pay_type,
            amount: Number(item.amount),
            type_id: item.type_id,
            type_name: item.type_name,
          });
        }
        if (!curr.length) {
          curr.push({
            pay_type: item.pay_type,
            amount: Number(item.amount),
            type_id: item.type_id,
            type_name: item.type_name,
          });
        }
        return curr;
      }, []);
      ctx.body = {
        code: 200,
        msg: 'succes',
        data: {
          total: listMap.length,
          totalExpanse,
          totalIncome,
          list: listMap,
        },
      };
    } catch (err) {
      console.log(err);
      ctx.body = {
        code: 500,
        msg: 'fail',
        data: null,
      };
    }

  }
  async delete() {
    const { ctx, app } = this;
    const { id } = ctx.request.body;
    if (!id) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
    }
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;
      const result = await ctx.service.bill.delete(id, user_id);
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
  async update() {
    const { ctx, app } = this;
    const { id, amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
    }
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;
    const user_id = decode.id;
    try {
      const result = await ctx.service.bill.update({
        id,
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id,
      });
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
  async detail() {
    const { ctx, app } = this;
    const { id = '' } = ctx.query;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;
    const user_id = decode.id;
    if (!id) {
      ctx.body = {
        code: 500,
        msg: 'id empty',
        data: null,
      };
      return;
    }
    try {
      const detail = await ctx.service.bill.detail(id, user_id);
      ctx.body = {
        code: 200,
        msg: 'success',
        data: detail,
      };
    } catch (err) {
      ctx.body = {
        code: 500,
        msg: 'fail',
        data: null,
      };
    }
  }
  async list() {
    const { ctx, app } = this;
    const { date, page = 1, page_size = 5, type_id = 'all', startDate, endDate } = ctx.query;
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;
      let list = await ctx.service.bill.list(user_id);
      if (startDate && endDate) {
        list = list.filter(item => {
          return moment(item.date, 'YYYY-MM-DD').isBetween(startDate, endDate, undefined, '[]');
        });
      }
      if (date) {
        list = list.filter(item => {
          return item.date === date;
        });
      }
      if (type_id !== 'all') {
        list = list.filter(item => {
          return item.type_id === Number(type_id);
        });
      }
      const totalIncome = list.reduce((curr, item) => {
        if (item.pay_type === 2) {
          curr += Number(item.amount);
        }
        return curr;
      }, 0);
      const totalExpanse = list.reduce((curr, item) => {
        if (item.pay_type === 1) {
          curr += Number(item.amount);
        }
        return curr;
      }, 0);
      let listMap = list.reduce((curr, item) => {
        const itemDate = item.date;
        if (curr.length && curr.findIndex(item => item.date === itemDate) > -1) {
          const index = curr.findIndex(item => item.date === itemDate);
          curr[index].bills.push(item);
        }
        if (curr.length && curr.findIndex(item => item.date === itemDate) === -1) {
          curr.push({
            date: itemDate,
            bills: [ item ],
          });
        }
        if (!curr.length) {
          curr.push({
            date: itemDate,
            bills: [ item ],
          });
        }
        return curr;
      }, []);
      listMap = listMap.sort((a, b) => moment(b.date, 'YYYY-MM-DD') - moment(a.date, 'YYYY-MM-DD'));
      const paginationList = listMap.slice((page - 1) * page_size, page * page_size);
      ctx.body = {
        code: 200,
        msg: 'succes',
        data: {
          total: listMap.length,
          page,
          page_size,
          totalExpanse,
          totalIncome,
          list: paginationList,
        },
      };
    } catch (err) {
      console.log(err);
      ctx.body = {
        code: 500,
        msg: 'fail',
        data: null,
      };
    }
  }
  async add() {
    const { ctx, app } = this;
    const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
    }
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;
      const result = await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id,
      });
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
}

module.exports = BillController;
