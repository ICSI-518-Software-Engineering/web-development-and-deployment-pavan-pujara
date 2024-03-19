import React, { useState } from 'react';
import axios from 'axios';

const Api = () => {
  const [query, setQuery] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${query}`);
      setPokemonData(response.data);
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
            <h5 className="card-title">{pokemonData.name}</h5>
            <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Api;
