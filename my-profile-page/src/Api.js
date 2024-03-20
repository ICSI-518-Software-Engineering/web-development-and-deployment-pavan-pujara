import React, { useState } from 'react';
import axios from 'axios';
import "./Api.css";

// Utility function to capitalize the first letter of each word for Title Case
const capitalize = (str) =>
  str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const Api = () => {
  const [query, setQuery] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      // Convert query to lowercase for API call
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      const pokemon = response.data;

      // Map the types to their names, then capitalize
      const types = pokemon.types.map((typeEntry) => capitalize(typeEntry.type.name));
      
      // If moves are available, get the first move's name and capitalize it
      const attack = pokemon.moves.length > 0 
        ? capitalize(pokemon.moves[0].move.name) 
        : 'None';

      // Capitalize the Pokemon's name
      const name = capitalize(pokemon.name);

      // Update state with the new capitalized data
      setPokemonData({ ...pokemon, name, types, attack });
      setError(null);
    } catch (err) {
      setPokemonData(null);
      setError('Pokemon not found!');
    }
  };

  return (
    <div className="container">
      <h1>PokeAPI Search</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Pokemon Name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button className="btn btn-primary mb-3" onClick={handleSearch}>
        Search
      </button>
      {error && <p className="text-danger">{error}</p>}
      {pokemonData && (
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">{pokemonData.name}</h3>
            <img src={pokemonData.sprites.front_default} alt={pokemonData.name} className='pokemon-image' />
            <h4>Type: {pokemonData.types.join(', ')}</h4>
            <h4>Attack: {pokemonData.attack}</h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default Api;
