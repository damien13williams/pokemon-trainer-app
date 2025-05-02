const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Pokemon, Trainer, Type } = require('../models');

// Show the form to add a new Pokémon
router.get('/pokemons/add', async (req, res) => {
  if (!req.session.trainerId) {
    return res.redirect('/login'); // Ensure the trainer is logged in
  }

  const trainerId = req.session.trainerId;

  try {
    const types = await Type.findAll();
    res.render('addPokemon', { trainerId, types, error: null });
  } catch (error) {
    console.error('Error fetching data for add Pokemon:', error);
    res.status(500).send('Error fetching data for add Pokemon');
  }
});

// Handle adding a new Pokémon
router.post('/pokemons/add', async (req, res) => {
  const { name, level, trainer_id, type_id } = req.body;
  const normalizedName = name.toLowerCase().trim();

  try {
    // Validate Pokémon name via PokéAPI
    await axios.get(`https://pokeapi.co/api/v2/pokemon/${normalizedName}`);

    // Proceed with creating the Pokémon if valid
    await Pokemon.create({
      name: normalizedName,
      level,
      trainer_id,
      type_id
    });

    res.redirect(`/trainers/${trainer_id}/pokemons`);
  } catch (error) {
    let errorMessage = 'Error adding Pokémon.';
    if (error.response && error.response.status === 404) {
      errorMessage = `Pokémon "${name}" does not exist in PokéAPI.`;
    }

    console.error('Add Pokémon error:', errorMessage);

    // Re-fetch types for the form re-render
    const types = await Type.findAll();
    res.status(400).render('addPokemon', {
      trainerId: trainer_id,
      types,
      error: errorMessage
    });
  }
});

// DELETE 
router.post('/pokemons/:id/delete', async (req, res) => {
  try {
    const pokemonId = req.params.id;
    const pokemon = await Pokemon.findByPk(pokemonId);

    if (!pokemon) {
      return res.status(404).send('Pokémon not found');
    }

    const trainerId = pokemon.trainer_id;
    await pokemon.destroy();
    res.redirect(`/trainers/${trainerId}/pokemons`);
  } catch (error) {
    console.error('Error deleting Pokémon:', error);
    res.status(500).send('Error deleting Pokémon');
  }
});

module.exports = router;
