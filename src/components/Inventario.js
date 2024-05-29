import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, query, where, orderBy, limit } from '../firebase';
import './Inventario.css';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [criterioBusqueda, setCriterioBusqueda] = useState('codigoProveedor');
  const [filtro, setFiltro] = useState('');

  const obtenerProductos = async () => {
    const productosSnapshot = await getDocs(collection(db, 'productos'));
    const productosList = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Obtener el último precio de venta para cada producto
    for (let producto of productosList) {
      const q = query(
        collection(db, 'compras'),
        where('codigoProveedor', '==', producto.proveedores[0]),
        orderBy('fecha', 'desc'),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const ultimaCompra = querySnapshot.docs[0].data();
        producto.ultimoPrecioVenta = ultimaCompra.precioVenta || '';
      } else {
        producto.ultimoPrecioVenta = 'No registrado';
      }
    }

    setProductos(productosList);
    setProductosFiltrados(productosList);
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const buscarProducto = (e) => {
    const valor = e.target.value.toLowerCase();
    setFiltro(valor);

    const productosFiltrados = productos.filter(producto => {
      switch (criterioBusqueda) {
        case 'codigoInterno':
          return producto.codigoInterno.toLowerCase().includes(valor);
        case 'codigoProveedor':
          return producto.proveedores[0] && producto.proveedores[0].toLowerCase().includes(valor);
        case 'categoria':
          return producto.categoria.toLowerCase().includes(valor);
        case 'marca':
          return producto.marca.toLowerCase().includes(valor);
        case 'descripcion':
          return producto.descripcion.toLowerCase().includes(valor);
        case 'ubicacion':
          return producto.ubicacion.toLowerCase().includes(valor);
        default:
          return false;
      }
    });

    setProductosFiltrados(productosFiltrados);
  };

  return (
    <div className="inventario-container">
      <h2>Inventario</h2>
      <div className="criterios-busqueda">
        <label>
          <input
            type="radio"
            value="codigoInterno"
            checked={criterioBusqueda === 'codigoInterno'}
            onChange={(e) => setCriterioBusqueda(e.target.value)}
          />
          Código Interno
        </label>
        <label>
          <input
            type="radio"
            value="codigoProveedor"
            checked={criterioBusqueda === 'codigoProveedor'}
            onChange={(e) => setCriterioBusqueda(e.target.value)}
          />
          Código Proveedor
        </label>
        <label>
          <input
            type="radio"
            value="categoria"
            checked={criterioBusqueda === 'categoria'}
            onChange={(e) => setCriterioBusqueda(e.target.value)}
          />
          Categoría
        </label>
        <label>
          <input
            type="radio"
            value="marca"
            checked={criterioBusqueda === 'marca'}
            onChange={(e) => setCriterioBusqueda(e.target.value)}
          />
          Marca
        </label>
        <label>
          <input
            type="radio"
            value="descripcion"
            checked={criterioBusqueda === 'descripcion'}
            onChange={(e) => setCriterioBusqueda(e.target.value)}
          />
          Descripción
        </label>
        <label>
          <input
            type="radio"
            value="ubicacion"
            checked={criterioBusqueda === 'ubicacion'}
            onChange={(e) => setCriterioBusqueda(e.target.value)}
          />
          Ubicación
        </label>
      </div>
      <input
        type="text"
        placeholder={`Ingrese ${criterioBusqueda}`}
        onChange={buscarProducto}
        value={filtro}
      />
      <table className="tabla-inventario">
        <thead>
          <tr>
            <th>Código Interno</th>
            <th>Código Proveedor</th>
            <th>Categoría</th>
            <th>Marca</th>
            <th>Descripción</th>
            <th>Stock</th>
            <th>Último Precio de Venta</th>
            <th>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.codigoInterno}</td>
              <td>{producto.proveedores ? producto.proveedores.join(', ') : ''}</td>
              <td>{producto.categoria}</td>
              <td>{producto.marca}</td>
              <td>{producto.descripcion}</td>
              <td>{producto.stock}</td>
              <td>{producto.ultimoPrecioVenta}</td>
              <td>{producto.ubicacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventario;
