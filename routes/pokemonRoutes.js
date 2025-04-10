const express = require('express');
const router = express.Router();
const { Pokemon, Trainer, Type } = require('../models');


// Show the form to add a new Pokémon
router.get('/pokemons/add', async (req, res) => {
  if (!req.session.trainerId) {
    return res.redirect('/login'); // Ensure the trainer is logged in
  }

  const trainerId = req.session.trainerId;
  try {
    const types = await Type.findAll();
    res.render('addPokemon', { trainerId, types });
  } catch (error) {
    console.error('Error fetching data for add Pokemon:', error);
    res.status(500).send('Error fetching data for add Pokemon');
  }
});

// Handle adding a new Pokémon
router.post('/pokemons/add', async (req, res) => {
  const { name, level, trainer_id, type_id } = req.body;
  try {
    const newPokemon = await Pokemon.create({ name, level, trainer_id, type_id });
    res.redirect(`/trainers/${trainer_id}/pokemons`);
  } catch (error) {
    console.error('Error adding Pokémon:', error);
    res.status(500).send('Error adding Pokémon');
  }
});

module.exports = router;
