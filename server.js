require("dotenv").config();
const express = require('express');
const path = require('path');
const session = require('express-session');
// const sequelize = require('./config/database');
const trainerRoutes = require('./routes/trainerRoutes');
const pokemonRoutes = require('./routes/pokemonRoutes');
const { sequelize, Trainer, Pokemon, Type } = require('./models'); 
const { Op } = require('sequelize');




const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));



app.use(trainerRoutes);
app.use(pokemonRoutes);

app.get('/', (req, res) => {
  res.render('index');  // Render the index page
});

app.get('/register', (req, res) => {
  res.render('registerTrainer');
});

app.get('/trainers', (req, res) => {
  res.render('trainersList');
});


// Route to display the login page
app.get('/login', (req, res) => {
  res.render('login', { message: null});
});

app.post('/login', async (req, res) => {
  const rawName = req.body.name;
  const rawEmail = req.body.email;

  const name = rawName.trim();
  const email = rawEmail.trim();

  try {
    const trainer = await Trainer.findOne({
      where: { name , email}
    });

    if (trainer) {
      req.session.trainerId = trainer.id;
      req.session.trainerName = trainer.name;
      res.redirect(`/trainers/${trainer.id}/pokemons`);
    } else {
      res.render('login', { message: 'Invalid email or name' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { message: 'Error during login' });
  }
});

// Route for dashboard (trainer's Pokémon list)
app.get('/dashboard', async (req, res) => {
  if (!req.session.trainerId) {
    return res.redirect('/login'); // Redirect to login if not authenticated
  }

  const loggedInTrainer = req.session.trainer; // or req.user if using Passport.js

  try {
    // Find the trainer by their session ID and include their Pokémon
    const trainer = await Trainer.findByPk(req.session.trainerId, {
      include: { model: Pokemon, include: Type }
    });

    if (!trainer) return res.status(404).send('Trainer not found');
    
    // Render the trainer's dashboard
    res.render('trainerDashboard', { trainer, pokemons: trainer.Pokemons });
  } catch (error) {
    console.error('Error fetching trainer:', error);
    res.status(500).send('Error fetching trainer');
  }
});


// Route to log out
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Error logging out');
    }
    res.redirect('/login');
  });
});


/* app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
*/

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully.');
    return sequelize.query('SELECT current_database();'); 
  })
  .then((result) => {
    console.log('Connected to database:', result[0]);
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });

sequelize.sync({ force: false })
  .then(() => {
    console.log("✅ Tables created or confirmed.");
    app.listen(3000, () => {
      console.log("🚀 Server running");
    });
  })
  .catch((error) => {
    console.error("❌ Error syncing with database:", error);
  });

