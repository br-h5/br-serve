module.exports = app => {
  const { STRING, INTEGER, TEXT } = app.Sequelize

  return app.model.define(
    'component',
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      description: STRING(100),
      name: STRING(100),
      author: STRING(100),
      gitUrl: STRING(200),
      config: TEXT,
      status: INTEGER,
    },
    {
      paranoid: true,
    }
  )
}
