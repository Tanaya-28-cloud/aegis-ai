const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/index');
const User = require('./User');

const ScanHistory = sequelize.define('ScanHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true, // allow anonymous scans (not logged in)
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  scan_type: {
    type: DataTypes.ENUM('email', 'url'),
    allowNull: false
  },
  input_hash: {
    type: DataTypes.STRING(64), // SHA-256 hex = always 64 chars
    allowNull: false
  },
  verdict: {
    type: DataTypes.ENUM('SAFE', 'FAKE', 'UNSAFE'),
    allowNull: false
  },
  confidence: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  reasons: {
    type: DataTypes.ARRAY(DataTypes.TEXT), // PostgreSQL text[] array
    defaultValue: []
  },
  layer_used: {
    type: DataTypes.INTEGER, // 1, 2, or 3
    allowNull: false
  },
  response_ms: {
    type: DataTypes.INTEGER, // how long the scan took in ms
    allowNull: true
  }
}, {
  tableName: 'scan_history',
  timestamps: true,
  underscored: true
});

// Association: a scan belongs to a user
ScanHistory.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(ScanHistory, { foreignKey: 'user_id' });

module.exports = ScanHistory;