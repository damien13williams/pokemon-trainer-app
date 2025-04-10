const express = require('express');
const router = express.Router();
const { Trainer, Pokemon, Type } = require('../models');
//const { Trainer } = require('../models'); // Ensure this import is correct

// Show the trainer registration form
router.get('/trainers/register', (req, res) => {
  res.render('registerTrainer');
});

// Register a new trainer
router.post('/trainers/register', async (req, res) => {
  const { name, email } = req.body;
  try {
    const newTrainer = await Trainer.create({ name, email });
    res.redirect(`/trainers/${newTrainer.id}/pokemons`);
  } catch (error) {
    console.error('Error registering trainer:', error);
    res.status(500).send('Error registering trainer');
  }
});

// Show a trainer's Pokémon list
router.get('/trainers/:trainerId/pokemons', async (req, res) => {
  const trainerId = req.params.trainerId;
  try {
    const trainer = await Trainer.findByPk(trainerId, {
      include: { model: Pokemon, include: Type }
    });
    if (!trainer) return res.status(404).send('Trainer not found');
    res.render('trainerDashboard', { trainer, pokemons: trainer.Pokemons });
  } catch (error) {
    console.error('Error fetching trainer:', error);
    res.status(500).send('Error fetching trainer');
  }
});

// Route to display the list of trainers
router.get('/trainers', async (req, res) => {
  try {
    const trainers = await Trainer.findAll();
    const trainersData = trainers.map(trainer => trainer.toJSON()); // Convert to plain objects
    console.log("Trainers Data:", trainers); // Log trainers data
    // Check if trainers is fetched and is an array
    console.log(trainers); // Check if trainers is an array of trainers

    // Pass trainers data to the EJS view
    res.render('trainersList', { trainers: trainers });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching trainers.');
  }
});



module.exports = router;
