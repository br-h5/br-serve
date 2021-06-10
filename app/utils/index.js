const fs = require('fs')
const process = require('child_process')

const utils = {
  existOrNot(path) {
    return new Promise((resolve, reject) => {
      fs.stat(path, err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  },
  mkdirFolder(name) {
    return new Promise((resolve, reject) => {
      process.exec(`mkdir ${name}`, err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  },
  formatWhereCase(params) {
    const where = {}
    Object.keys(params)
      .forEach(key => {
        if (params[key]) {
          where[key] = params[key]
        }
      })
    return where
  }
}

module.exports = utils
