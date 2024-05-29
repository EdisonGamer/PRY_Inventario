import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, addDoc, doc, updateDoc, query, where, orderBy, limit, increment } from '../firebase';
import './RegistrarVenta.css';

const RegistrarVenta = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [codigoProveedor, setCodigoProveedor] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
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

  const registrarVenta = async () => {
    if (!productoSeleccionado) {
      setError('Seleccione un producto para registrar la venta.');
      return;
    }

    if (productoSeleccionado.stock < parseInt(cantidad, 10)) {
      setError('Cantidad solicitada excede el stock disponible.');
      return;
    }

    try {
      await addDoc(collection(db, 'ventas'), {
        codigoProveedor: productoSeleccionado.proveedores[0],
        cantidad: parseInt(cantidad, 10),
        fecha,
        precioVenta: parseFloat(precioVenta)
      });

      await updateDoc(doc(db, 'productos', productoSeleccionado.id), {
        stock: increment(-parseInt(cantidad, 10))
      });

      alert('Venta registrada exitosamente');
      resetFormulario();
      obtenerProductos(); // Refrescar la lista de productos después de registrar la venta
    } catch (error) {
      alert('Error al registrar la venta: ' + error.message);
    }
  };

  const seleccionarProducto = async (producto) => {
    setProductoSeleccionado(producto);
    setCodigoProveedor(producto.proveedores[0]);

    // Obtener el último precio de venta registrado
    const q = query(
      collection(db, 'compras'),
      where('codigoProveedor', '==', producto.proveedores[0]),
      orderBy('fecha', 'desc'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const ultimaCompra = querySnapshot.docs[0].data();
      setPrecioVenta(ultimaCompra.precioVenta || '');
    }

    setError('');
  };

  const resetFormulario = () => {
    setCantidad('');
    setFecha('');
    setProductoSeleccionado(null);
    setCodigoProveedor('');
    setPrecioVenta('');
    setFiltro('');
    setError('');
    setProductosFiltrados(productos);
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
    <div className="registrar-venta-container">
      <div className="form-container">
        <h2>Registrar Venta</h2>
        <form onSubmit={(e) => { e.preventDefault(); registrarVenta(); }}>
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
            <label>Precio Venta Final</label>
            <input
              type="number"
              step="0.01"
              value={precioVenta}
              readOnly
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="form-buttons">
            <button type="submit" className="btn-registrar-venta">Registrar Venta</button>
            {productoSeleccionado && (
              <button type="button" className="btn-cancelar" onClick={resetFormulario}>Cancelar</button>
            )}
          </div>
        </form>
        <button className="btn-regresar" onClick={() => window.location.href = '/home'}>Regresar</button>
      </div>

      <div className="tabla-container">
        <h2>Buscar por</h2>
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
                  <button onClick={() => seleccionarProducto(producto)}>Seleccionar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistrarVenta;
