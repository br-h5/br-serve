const Controller = require('egg').Controller
const utils = require('../../utils')

class TemplateController extends Controller {
  async query() {
    const { id, gitUrl } = this.ctx.params
    const where = utils.formatWhereCase({ id, gitUrl })
    const result = await this.ctx.model.Template.findAll({
      where
    })
    this.ctx.body = {
      success: true,
      result
    }
  }

  async updateTemplate() {
    const { params } = this.ctx
    const { name, gitUrl } = params
    const { model } = this.ctx
    if (gitUrl && name) {
      const transaction = await this.ctx.model.transaction()
      try {
        const result = await model.Template.findOne({
          gitUrl
        })

        if (result) {
          await model.Template.update(params, {
            where: {
              gitUrl
            }
          }, { transaction })
          const res = await model.Template.findOne({
            where: {
              gitUrl
            }
          })
          this.ctx.body = {
            success: true,
            result: res
          }
        } else {
          const result = await model.Template.create({
            ...params,
            type: 0
          }, { transaction })
          this.ctx.body = {
            success: true,
            result
          }
        }
      } catch (e) {
        this.ctx.logger.debug('updateTemplate', e)
        transaction.rollback()
        this.ctx.body = {
          success: false,
          msg: e
        }
      }
    }
  }
}

module.exports = TemplateController
