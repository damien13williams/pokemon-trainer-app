const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // To access your environment variables
const sequelize = require('../config/database');
/* // Create a Sequelize instance and connect to the database using environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Database name from .env
  process.env.DB_USER,      // Database user from .env
  process.env.DB_PASSWORD,  // Database password from .env
  {
    host: process.env.DB_HOST || 'localhost',  
    dialect: 'postgres',                       
  }
);
*/
// Define the Trainer model
const Trainer = sequelize.define('Trainer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
    timestamps: false 
});


// Define the Type model
const Type = sequelize.define('Type', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
    timestamps: false 
});

// Define the Pokemon model
const Pokemon = sequelize.define('Pokemon', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  trainer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },}, {
  timestamps: false
});

// Set up associations between models
Trainer.hasMany(Pokemon, { foreignKey: 'trainer_id', onDelete: 'CASCADE' });
Pokemon.belongsTo(Trainer, { foreignKey: 'trainer_id', onDelete: 'CASCADE' });

Type.hasMany(Pokemon, { foreignKey: 'type_id', onDelete: 'CASCADE' });
Pokemon.belongsTo(Type, { foreignKey: 'type_id' });

// Export the Sequelize instance and models
module.exports = { sequelize, Trainer, Type, Pokemon };
