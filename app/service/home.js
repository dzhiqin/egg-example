const Service = require('egg').Service;

class HomeService extends Service {
  async user() {
    const { ctx, app } = this;
    const QUERY_STR = 'id,name';
    const sql = `select ${QUERY_STR} from list`;
    try {
      const result = await app.mysql.query(sql);
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async addUser(name) {
    const { ctx, app } = this;
    try {
      const result = await app.mysql.insert('list', { name });
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async editUser(id, name) {
    const { ctx, app } = this;
    try {
      const result = await app.mysql.update('list', { name }, {
        where: {
          id,
        },
      });
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async deleteUser(id) {
    const { app } = this;
    try {
      const result = await app.mysql.delete('list', { id });
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
module.exports = HomeService;
