import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: '',
    image: null, // Prepare for image file handling
  });
  const [editingId, setEditingId] = useState(null); // Track which item is being edited
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    image: null,
  });

  useEffect(() => {
    fetchItems().catch(console.error);
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://ec2-18-118-105-153.us-east-2.compute.amazonaws.com:3001/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error; // Rethrow for useEffect catch
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editingId ? editFormData.name : newItem.name);
    formData.append('description', editingId ? editFormData.description : newItem.description);
    formData.append('quantity', editingId ? editFormData.quantity.toString() : newItem.quantity.toString());

    // Handle image if present
    if (editingId && editFormData.image) {
      formData.append('image', editFormData.image);
    } else if (!editingId && newItem.image) {
      formData.append('image', newItem.image);
    }

    try {
      if (editingId) {
        await axios.put(`http://ec2-18-118-105-153.us-east-2.compute.amazonaws.com:3001/items/${editingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('http://ec2-18-118-105-153.us-east-2.compute.amazonaws.com:3001/items', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      return; // Early return on error
    }

    setNewItem({ name: '', description: '', quantity: '', image: null }); // Reset form state
    setEditingId(null); // Clear editing state
    await fetchItems(); // Refresh items list
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://ec2-18-118-105-153.us-east-2.compute.amazonaws.com:3001/items/${id}`);
      await fetchItems(); // Refresh items
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditFormData({
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      image: null, // Reset image field for editing
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const update = files ? { [name]: files[0] } : { [name]: value };
    if (editingId) {
      setEditFormData({ ...editFormData, ...update });
    } else {
      setNewItem({ ...newItem, ...update });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
              <input type="text" className="form-control" name="name" placeholder="Item Name" value={editingId ? editFormData.name : newItem.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <input type="text" className="form-control" name="description" placeholder="Description" value={editingId ? editFormData.description : newItem.description} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <input type="number" className="form-control" name="quantity" placeholder="Quantity" value={editingId ? editFormData.quantity : newItem.quantity} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <input type="file" className="form-control" name="image" onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Item' : 'Add Item'}
            </button>
          </form>
        </div>
      </div>
      <div className="row mt-5">
        {items.map((item) => (
          <div key={item._id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">Quantity: {item.quantity}</h6>
                <p className="card-text">{item.description}</p>
                {item.image && <img src={`data:image/jpeg;base64,${item.image}`} alt="Item"
                style={{ width: '100px', height: '100px' }} />}
              </div>
                <button onClick={() => handleEdit(item)} className="m-1 btn btn-secondary">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="m-1 btn btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

