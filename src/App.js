// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Inventory from './components/Inventory';
import RegistrarProducto from './components/RegistrarProducto';
import RegistrarCompra from './components/RegistrarCompra';
import RegistrarVenta from './components/RegistrarVenta';
import Reportes from './components/Reportes';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/registrar-producto" component={RegistrarProducto} />
        <Route path="/registrar-compra" component={RegistrarCompra} />
        <Route path="/registrar-venta" component={RegistrarVenta} />
        <Route path="/reportes" component={Reportes} />
      </Switch>
    </Router>
  );
}

export default App;
