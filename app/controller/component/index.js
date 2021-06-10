const Controller = require('egg').Controller
const utils = require('../../utils')

class CompnentController extends Controller {
  async query() {
    const { id, gitUrl } = this.ctx.params

    const where = utils.formatWhereCase({ id, gitUrl })
    this.ctx.body = {
      success: true,
      result: await this.ctx.model.Component.findAll({
        where,
      }),
    }
  }

  async addComponent() {
    const { gitUrl, description, name, config, status = 0 } = this.ctx.params
    if (gitUrl && name) {
      try {
        const result = await this.ctx.model.Component.create({
          gitUrl,
          config,
          description,
          name,
          status,
        })
        this.ctx.body = {
          success: true,
          result,
        }
      } catch (e) {
        console.log(e)
        this.ctx.status = 500
        this.ctx.body = {
          success: false,
          result: e,
        }
      }
    } else {
      this.ctx.status = 500
      this.ctx.body = {
        success: false,
        result: true,
        msg: '参数缺失',
      }
    }
  }

  async updateComponent() {
    const { model } = this.ctx
    const { params } = this.ctx
    const { id, gitUrl } = params

    const where = utils.formatWhereCase({ id, gitUrl })
    try {
      const result = await model.Component.update(params, {
        where,
      })
      this.ctx.body = {
        success: true,
        result,
      }
    } catch (e) {
      console.log(e)
      this.ctx.status = 500
      this.ctx.body = {
        success: false,
        result: e,
      }
    }
  }
}

module.exports = CompnentController
