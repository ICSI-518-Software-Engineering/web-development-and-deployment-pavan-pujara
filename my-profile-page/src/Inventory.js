import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inventory.css'; // Import the CSS file

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryItems, setInventoryItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    image: '',
  });

  useEffect(() => {
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

  const handleAddItem = () => {
    setInventoryItems([...inventoryItems, newItem]);
    setNewItem({ name: '', quantity: '', image: '' });
  };

  const handleSaveItem = (id) => {
    setEditingItemId(null);
  };

  const handleEditItem = (id) => {
    setEditingItemId(id);
  };

  const handleDeleteItem = (id) => {
    setInventoryItems(inventoryItems.filter(item => item.id !== id));
  };

  const handleEditChange = (id, value, field) => {
    // Find the item being edited
    const editedItemIndex = inventoryItems.findIndex(item => item.id === id);
    if (editedItemIndex !== -1) {
      // Create a copy of the edited item
      const editedItemCopy = { ...inventoryItems[editedItemIndex] };
      // Update the edited field
      editedItemCopy[field] = value;
      // Create a new inventory array with the edited item
      const updatedInventory = [...inventoryItems];
      updatedInventory[editedItemIndex] = editedItemCopy;
      // Update the state with the new inventory
      setInventoryItems(updatedInventory);
    }
  };

  return (
    <div className="container">
      <h1>Inventory</h1>
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name..."
          className="form-control"
        />
        <button className="btn btn-blue" onClick={handleSearch}>Search</button>
      </div>
      <div className="inventory-list">
        {inventoryItems.map((item) => (
          <div key={item.id} className="card">
            <img src={item.image} alt={item.name} />
            <div className="card-body">
              {editingItemId === item.id ? (
                <>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleEditChange(item.id, e.target.value, 'name')}
                    className="form-control"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleEditChange(item.id, e.target.value, 'quantity')}
                    className="form-control"
                  />
                  <div className="button-container">
                    <button className="btn btn-green" onClick={() => handleSaveItem(item.id)}>Save</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="card-title">{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <div className="button-container">
                    <button className="btn btn-blue" onClick={() => handleAddItem(item.id)}>Add</button>
                    <button className="btn btn-red" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                    <button className="btn btn-orange" onClick={() => handleEditItem(item.id)}>Edit</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
