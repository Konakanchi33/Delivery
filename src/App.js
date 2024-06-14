import React, { useState } from 'react';
import axios from 'axios';
import Delivery from './components/Delivery';
import Icon from './components/Icon';

import './App.css'; // Import the CSS file

const App = () => {
  const [deliveryId, setDeliveryId] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedHub, setSelectedHub] = useState('');
  const [weight, setWeight] = useState('');
  const [vehicle, setVehicle] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.get(`http://localhost:80/music/${deliveryId}`);
      const deliveryData = response.data;
      console.log('API Response:', deliveryData); // Debugging line

      if (deliveryData.error) {
        setSelectedAddress('');
        setSelectedHub('');
        setWeight('');
        setVehicle('');
        alert('Delivery ID not found');
      } else {
        setSelectedAddress(deliveryData.DeliveryAddress);
        setSelectedHub(deliveryData.HubAddress);
        setWeight(deliveryData.Weight); // Correct key
        setVehicle(deliveryData.DeliveryMode); // Correct key
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <h1>Enter Delivery ID to Display Delivery Mode</h1>
      <input
        type="text"
        value={deliveryId}
        onChange={e => setDeliveryId(e.target.value)}
        placeholder="Enter Delivery ID"
      />
      <button onClick={handleSubmit}>Submit</button>

      {selectedAddress && selectedHub && weight && vehicle && (
        <div className="delivery-info">
          <p>
            <strong>Delivery ID:</strong> {deliveryId}, 
            <strong> Delivery Address:</strong> {selectedAddress}, 
            <strong> Hub Address:</strong> {selectedHub}, 
            <strong> Weight:</strong> {weight}, 
            <strong> Delivery Mode:</strong> {vehicle}
          </p>
          
          <Delivery address={selectedAddress} hub={selectedHub} />
        </div>
      )}
    </div>
  );
};

export default App;
