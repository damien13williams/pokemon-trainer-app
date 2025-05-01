const express = require('express');
const router = express.Router();
const { Pokemon, Trainer, Type } = require('../models');
const axios = require('axios');


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

module.exports = router;
