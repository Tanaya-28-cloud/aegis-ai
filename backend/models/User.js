const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/index');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
    // NOTE: Always store bcrypt hash — never plain text
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true // maps createdAt → created_at in DB
});

module.exports = User;