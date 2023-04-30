import expressSession from 'express-session'
import connectSessionSequelize from 'connect-session-sequelize'

const SequelizeStore = connectSessionSequelize(expressSession.Store)

function extendDefaultFields(defaults, session) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: session.userId
  }
}

export default (db) => new SequelizeStore({
  db,
  table: 'Session',
  extendDefaultFields
})