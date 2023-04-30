import Sequelize from 'sequelize'
import expressSession from 'express-session'
import connectSessionSequelize from 'connect-session-sequelize'

import User from '../models/User.js'
import sequelize from './database.js'

const SequelizeStore = connectSessionSequelize(expressSession.Store)

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

const sequelizeStore = new SequelizeStore({
  db: sequelize,
  table: 'Session',
  extendDefaultFields
})

export default sequelizeStore