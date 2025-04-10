const sequelize = require('./config/database');
const Trainer = require('./models/Trainer');
const Pokemon = require('./models/Pokemon');
const Type = require('./models/Type');

sequelize.sync({ force: true }).then(() => {
  console.log('Database synced!');
}).catch(err => console.log(err));
