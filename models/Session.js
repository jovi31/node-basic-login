import { DataTypes } from 'sequelize'

import sequelize from '../config/database.js'

const Session = sequelize.define('Session', {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  userId: DataTypes.INTEGER,
  expires: DataTypes.DATE,
  data: DataTypes.TEXT,
}, { timestamps: false })

export default Session