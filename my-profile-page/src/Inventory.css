import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    // Fetch inventory items from the server when the component mounts
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get(`/api/inventory?search=${searchTerm}`);
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  const handleSearch = () => {
    fetchInventoryItems();
  };

  return (
    <div>
      <h1>Inventory</h1>
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="inventory-list">
        {inventoryItems.map((item) => (
          <div key={item.id} className="inventory-item">
            <img src={item.image} alt={item.name} />
            <div>
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
