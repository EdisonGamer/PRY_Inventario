import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, addDoc, doc, updateDoc, increment } from '../firebase';
import './RegistrarCompra.css';

const RegistrarCompra = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [codigoProveedor, setCodigoProveedor] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [error, setError] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [criterioBusqueda, setCriterioBusqueda] = useState('codigoProveedor');
  const [filtro, setFiltro] = useState('');

  const obtenerProductos = async () => {
    const productosSnapshot = await getDocs(collection(db, 'productos'));
    const productosList = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProductos(productosList);
    setProductosFiltrados(productosList);
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const registrarCompra = async () => {
    if (!productoSeleccionado) {
      setError('Seleccione un producto para registrar la compra.');
      return;
    }

    try {
      await addDoc(collection(db, 'compras'), {
        codigoProveedor: productoSeleccionado.proveedores[0],
        cantidad: parseInt(cantidad, 10),
        fecha,
        precioCompra: parseFloat(precioCompra),
        precioVenta: parseFloat(precioVenta),
      });

      await updateDoc(doc(db, 'productos', productoSeleccionado.id), {
        stock: increment(parseInt(cantidad, 10))
      });

      alert('Compra registrada exitosamente');
      resetFormulario();
      obtenerProductos(); // Refrescar la lista de productos después de registrar la compra
    } catch (error) {
      alert('Error al registrar la compra: ' + error.message);
    }
  };

  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setCodigoProveedor(producto.proveedores[0]);
    setError('');
  };

  const resetFormulario = () => {
    setCantidad('');
    setFecha('');
    setPrecioCompra('');
    setPrecioVenta('');
    setProductoSeleccionado(null);
    setCodigoProveedor('');
    setFiltro('');
    setError('');
    setProductosFiltrados(productos); // Restablecer la lista filtrada a todos los productos
  };

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
        default:
          return false;
      }
    });

    setProductosFiltrados(productosFiltrados);
  };

  return (
    <div className="registrar-compra-container">
      <div className="form-container">
        <h2>Registrar Compra</h2>
        <form onSubmit={(e) => { e.preventDefault(); registrarCompra(); }}>
          <div className="form-group">
            <label>Código Proveedor</label>
            <input
              type="text"
              value={codigoProveedor}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Cantidad</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Precio de Compra</label>
            <input
              type="text"
              value={precioCompra}
              onChange={(e) => setPrecioCompra(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Precio de Venta</label>
            <input
              type="text"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="form-buttons">
            <button type="submit" className="btn-registrar-compra">Registrar Compra</button>
            {productoSeleccionado && (
              <button type="button" className="btn-cancelar" onClick={resetFormulario}>Cancelar</button>
            )}
          </div>
        </form>
        <button className="btn-regresar" onClick={() => window.location.href = '/home'}>Regresar</button>
      </div>

      <div className="tabla-container">
        <h2>Buscar por</h2>
        <div className="busqueda">
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
        </div>
        <input
          type="text"
          placeholder={`Ingrese ${criterioBusqueda}`}
          onChange={buscarProducto}
          value={filtro}
        />
        <h2>Lista de Productos</h2>
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Código Interno</th>
              <th>Código Proveedor</th>
              <th>Categoría</th>
              <th>Marca</th>
              <th>Descripción</th>
              <th>Stock</th>
              <th>Acciones</th>
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
                <td>
                  <button className="btn-seleccionar" onClick={() => seleccionarProducto(producto)}>Seleccionar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistrarCompra;
