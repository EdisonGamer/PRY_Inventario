import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, query, where, doc, updateDoc } from '../firebase';
import { useNavigate } from 'react-router-dom';  // Importar useNavigate
import './RegistrarProducto.css';

const RegistrarProducto = () => {
  const [productos, setProductos] = useState([]);
  const [codigoInterno, setCodigoInterno] = useState('');
  const [codigoProveedor, setCodigoProveedor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [marca, setMarca] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(false);
  const [idProducto, setIdProducto] = useState('');
  const navigate = useNavigate();  // Inicializar useNavigate

  const obtenerProductos = async () => {
    const productosSnapshot = await getDocs(collection(db, 'productos'));
    const productosList = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProductos(productosList);
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const agregarProducto = async () => {
    try {
      const q = query(collection(db, 'productos'), where('proveedores', 'array-contains', codigoProveedor));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('El código de proveedor ya está registrado.');
        return;
      }

      await addDoc(collection(db, 'productos'), {
        codigoInterno,
        categoria,
        marca,
        descripcion,
        stock: parseInt(stock, 10),
        proveedores: [codigoProveedor]
      });

      alert('Producto agregado exitosamente');
      resetFormulario();
      obtenerProductos();
    } catch (error) {
      alert('Error al agregar el producto: ' + error.message);
    }
  };

  const actualizarProducto = async () => {
    try {
      const productoRef = doc(db, 'productos', idProducto);
      await updateDoc(productoRef, {
        categoria,
        marca,
        descripcion,
        stock: parseInt(stock, 10),
      });

      alert('Producto actualizado exitosamente');
      resetFormulario();
      obtenerProductos();
    } catch (error) {
      alert('Error al actualizar el producto: ' + error.message);
    }
  };

  const seleccionarProducto = (producto) => {
    setCodigoInterno(producto.codigoInterno);
    setCodigoProveedor(producto.proveedores[0]);  // Suponiendo que solo hay un proveedor
    setCategoria(producto.categoria);
    setMarca(producto.marca);
    setDescripcion(producto.descripcion);
    setStock(producto.stock);
    setEditando(true);
    setIdProducto(producto.id);
  };

  const resetFormulario = () => {
    setCodigoInterno('');
    setCodigoProveedor('');
    setCategoria('');
    setMarca('');
    setDescripcion('');
    setStock('');
    setError('');
    setEditando(false);
    setIdProducto('');
  };

  return (
    <div className="registrar-producto-container">
      <div className="form-container">
        <h2>{editando ? 'Actualizar Producto' : 'Registrar Producto'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); editando ? actualizarProducto() : agregarProducto(); }}>
          <div className="form-group">
            <label>Código Interno</label>
            <input
              type="text"
              value={codigoInterno}
              onChange={(e) => setCodigoInterno(e.target.value)}
              required
              disabled={editando}
            />
          </div>
          <div className="form-group">
            <label>Código Proveedor</label>
            <input
              type="text"
              value={codigoProveedor}
              onChange={(e) => setCodigoProveedor(e.target.value)}
              required
              disabled={editando}
            />
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Marca</label>
            <input
              type="text"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="form-buttons">
            <button type="submit" className="btn-agregar-producto">
              {editando ? 'Actualizar Producto' : 'Agregar Producto'}
            </button>
            {editando && (
              <button type="button" className="btn-cancelar" onClick={resetFormulario}>
                Cancelar
              </button>
            )}
          </div>
        </form>
        <button className="btn-regresar" onClick={() => navigate('/home')}>Regresar</button>
      </div>

      <div className="tabla-container">
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
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.codigoInterno}</td>
                <td>{producto.proveedores ? producto.proveedores.join(', ') : ''}</td>
                <td>{producto.categoria}</td>
                <td>{producto.marca}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.stock}</td>
                <td>
                  <button onClick={() => seleccionarProducto(producto)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistrarProducto;
