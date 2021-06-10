const Controller = require('egg').Controller

class ProjectController extends Controller {
  async query() {
    const { id } = this.ctx.params

    const where = {}
    if (id) {
      where.id = id
    }
    const result = await this.ctx.model.Project.findAll({
      where,
      order: [
        ['updateAt', 'DESC']
      ]
    })
    result.forEach(p => {
      p.pageConfig = JSON.parse(p.pageConfig)
      p.gitConfig = JSON.parse(p.gitConfig)
      p.releaseInfo = JSON.parse(p.releaseInfo)
    })
    this.ctx.body = {
      success: true,
      result
    }
  }

  async createProject() {
    const { params, model, service } = this.ctx
    const { pageConfig } = params
    const {
      gitName: name,
      templateName,
      templateGit,
      templateId,
      version,
    } = pageConfig.config
    // github 创建项目
    const result = await service.project.createProject({
      ...pageConfig.config,
      name,
      data: pageConfig,
      templateConfig: {
        templateName,
        git: templateGit,
      },
    })
    // 本地环境注释，result mock结果
    // const result = {}

    const project = await model.Project.create({
      templateId,
      name,
      pageConfig: JSON.stringify(pageConfig),
      gitConfig: JSON.stringify(result),
      version
    })

    this.ctx.body = {
      success: true,
      result: project
    }
  }

  async perview() {
    const { id } = this.ctx.params

    if (!id) {
      this.ctx.body = {
        success: false,
        msg: '预览项目信息必传'
      }
      return
    }
    const where = {
      id
    }
    const { dataValues: project } = await this.ctx.model.Project.findOne({
      where
    })
    const page = JSON.parse(project.pageConfig)
    this.ctx.body = {
      success: true,
      result: {
        ...page,
        components: page.userSelectComponents,
        pageData: page.config
      }
    }
  }
}

module.exports = ProjectController
