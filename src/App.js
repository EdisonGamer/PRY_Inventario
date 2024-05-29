// src/App.js
import React from 'react';
import './App.css';
import Login from './components/Login';
import Inventory from './components/Inventory';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Login />
        <Inventory />
      </header>
    </div>
  );
}

export default App;
