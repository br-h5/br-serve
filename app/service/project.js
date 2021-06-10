const Service = require('egg').Service
const { Octokit } = require('@octokit/core')
const download = require('download-git-repo')
const process = require('child_process')
const utils = require('../utils')
const fs = require('fs')
const octokit = new Octokit({ auth: 'your_access_token' })

function downloadFunc(downloadRepoUrl, tempDest) {
  return new Promise((resolve, reject) => {
    console.log(downloadRepoUrl)
    download(downloadRepoUrl, tempDest, err => {
      if (err) {
        console.error(err)
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('请求模板下载失败')
      } else {
        resolve('模板下载成功')
      }
    })
  })
}

async function release(repoUrl, repoName) {
  try {
    process.execSync(
      `cd static/${repoName}/dist && 
      git init &&
      git remote add origin ${repoUrl} &&
      git add -A &&
      git commit -m 'deploy' &&
      git push -f ${repoUrl} master:gh-pages &&
      cd -`
    )
  } catch (e) {
    console.log(e)
  } finally {
    process.exec(`cd static && rm -rf ${repoName}`)
  }
}

async function renderTpl({ templateGit, name: repoName, data, repoUrl, templateConfig }) {
  if (!(await utils.existOrNot('./static'))) {
    await utils.mkdirFolder('static')
  }
  const tempDest = `static/${templateConfig.templateName || repoName}`
  if (!(await utils.existOrNot(tempDest))) {
    await downloadFunc(templateConfig.git || repoUrl, tempDest)
  }

  const res = fs.readFileSync(`${tempDest}/dist/index.html`, 'utf-8')
  let target = res.replace(/(?<=<script data-inject>).*?(?=<\/script>)/, `window.__br_config__=${JSON.stringify(({
    ...data,
    components: data.userSelectComponents
  }))}`)

  target = target.replace(/(?<=<title>).*?(?=<\/title>)/, data.config.projectName)

  fs.writeFileSync(`${tempDest}/dist/index.html`, target)

  await release(repoUrl, templateConfig.templateName || repoName)

  return Promise.resolve({})
}

class ProjectService extends Service {
  async createProject(config) {
    const { data: { id, ssh_url } } = await octokit.request('POST /orgs/br-h5/repos', {
      org: 'br-h5',
      name: config.name
    })

    await renderTpl({
      ...config,
      repoUrl: ssh_url
    })
    return { id, ssh_url }
  }
}

module.exports = ProjectService
