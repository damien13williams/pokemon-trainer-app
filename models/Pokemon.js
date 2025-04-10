const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Trainer = require('./Trainer');
const Type = require('./Type');

const Pokemon = sequelize.define('Pokemon', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: false // Disable timestamps (createdAt, updatedAt)
});

Pokemon.belongsTo(Trainer, { foreignKey: 'trainer_id' });
Pokemon.belongsTo(Type, { foreignKey: 'type_id' });

module.exports = Pokemon;
