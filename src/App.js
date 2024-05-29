// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Inventory from './components/Inventory';
import RegistrarProducto from './components/RegistrarProducto';
import RegistrarCompra from './components/RegistrarCompra';
import RegistrarVenta from './components/RegistrarVenta';
import Reportes from './components/Reportes';
import ControlStock from './components/ControlStock';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/registrar-producto" element={<RegistrarProducto />} />
        <Route path="/registrar-compra" element={<RegistrarCompra />} />
        <Route path="/registrar-venta" element={<RegistrarVenta />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/control-stock" element={<ControlStock />} />
      </Routes>
    </Router>
  );
}

export default App;
