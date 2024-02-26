import './Addition.css';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';


const AdditionPage = () => {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [clientResult, setClientResult] = useState(null);
  const [serverResult, setServerResult] = useState(null);

  const handleAddition = () => {
    const result = Number(num1) + Number(num2);
    setClientResult(result);
    axios.get('http://localhost:3000/addition', {
      params: {
        num1: num1,
        num2: num2
      }
    })
    .then(response => {
      setServerResult(response.data.result);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
     <div>
 
      <div>
        <div>
          <label>
            Number 1:
            <input type="text" value={num1} onChange={(e) => setNum1(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Number 2:
            <input type="text" value={num2} onChange={(e) => setNum2(e.target.value)} />
          </label>
        </div>
        <div>
          <button onClick={handleAddition}>Submit</button>
        </div>
        <div className='result-container'>
          <h2>Client Result: {clientResult !== null ? clientResult : '-'}</h2>
          <h2>Server Result: {serverResult !== null ? serverResult : '-'}</h2>
        </div>
      </div>
    </div>
  );
};

export default AdditionPage;
