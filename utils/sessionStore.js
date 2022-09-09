const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const Sequelize = require('sequelize')

const User = require('../models/User')
const sequelize = require('../utils/database')

const Session = sequelize.define('Session', {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  userId: Sequelize.INTEGER,
  expires: Sequelize.DATE,
  data: Sequelize.TEXT,
}, { timestamps: false });

Session.belongsTo(User)

function extendDefaultFields(defaults, session) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: session.userId
  }
}

module.exports = new SequelizeStore({
  db: sequelize,
  table: 'Session',
  extendDefaultFields
})