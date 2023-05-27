import { DataTypes } from 'sequelize'

import Session from './Session.js'

import sequelize from '../config/database.js'

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  imgUrl: DataTypes.STRING,
  authProvider: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'local'
  },
}, { timestamps: false })

Session.belongsTo(User)

export default User