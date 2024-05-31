import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from '../firebase';
import { 
  Container, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home'; // Importa el icono Home
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la navegación

const RegistrarProducto = () => {
  const [productos, setProductos] = useState([]);
  const [codigoInterno, setCodigoInterno] = useState('');
  const [codigoProveedor, setCodigoProveedor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [marca, setMarca] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(false);
  const [idProducto, setIdProducto] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('codigoInterno');
  const [open, setOpen] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const navigate = useNavigate(); // Hook para la navegación

  const obtenerProductos = async () => {
    const productosSnapshot = await getDocs(collection(db, 'productos'));
    const productosList = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    productosList.sort((a, b) => a.codigoInterno.localeCompare(b.codigoInterno));
    setProductos(productosList);
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const agregarProducto = async () => {
    try {
      const q = query(collection(db, 'productos'), where('proveedores', 'array-contains', codigoProveedor.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('El código de proveedor ya está registrado.');
        return;
      }

      await addDoc(collection(db, 'productos'), {
        codigoInterno: codigoInterno.toUpperCase(),
        categoria: categoria.toUpperCase(),
        marca: marca.toUpperCase(),
        descripcion: descripcion.toUpperCase(),
        stock: parseInt(stock, 10),
        ubicacion: ubicacion.toUpperCase(),
        proveedores: [codigoProveedor.toUpperCase()]
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
        categoria: categoria.toUpperCase(),
        marca: marca.toUpperCase(),
        descripcion: descripcion.toUpperCase(),
        stock: parseInt(stock, 10),
        ubicacion: ubicacion.toUpperCase()
      });

      alert('Producto actualizado exitosamente');
      resetFormulario();
      obtenerProductos();
    } catch (error) {
      alert('Error al actualizar el producto: ' + error.message);
    }
  };

  const eliminarProducto = async () => {
    try {
      await deleteDoc(doc(db, 'productos', productoAEliminar));
      alert('Producto eliminado exitosamente');
      setProductoAEliminar(null);
      setOpen(false);
      obtenerProductos();
    } catch (error) {
      alert('Error al eliminar el producto: ' + error.message);
    }
  };

  const seleccionarProducto = (producto) => {
    setCodigoInterno(producto.codigoInterno);
    setCodigoProveedor(producto.proveedores[0]);
    setCategoria(producto.categoria);
    setMarca(producto.marca);
    setDescripcion(producto.descripcion);
    setStock(producto.stock);
    setUbicacion(producto.ubicacion);
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
    setUbicacion('');
    setError('');
    setEditando(false);
    setIdProducto('');
  };

  const handleClickOpen = (id) => {
    setProductoAEliminar(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const productosFiltrados = productos.filter(producto => {
    const term = searchTerm.toLowerCase();
    switch (searchBy) {
      case 'codigoInterno':
        return producto.codigoInterno.toLowerCase().includes(term);
      case 'codigoProveedor':
        return producto.proveedores.some(proveedor => proveedor.toLowerCase().includes(term));
      case 'categoria':
        return producto.categoria.toLowerCase().includes(term);
      case 'descripcion':
        return producto.descripcion.toLowerCase().includes(term);
      case 'ubicacion':
        return producto.ubicacion.toLowerCase().includes(term);
      default:
        return true;
    }
  });

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Registrar Producto
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<HomeIcon />}
        onClick={() => navigate('/home')}
        style={{ marginBottom: '20px' }}
      >
        Menú Principal
      </Button>
      <Box display="flex" justifyContent="space-between">
        <Box flexBasis="25%">
          <form onSubmit={(e) => { e.preventDefault(); editando ? actualizarProducto() : agregarProducto(); }}>
            <TextField
              fullWidth
              label="Código Interno"
              value={codigoInterno}
              onChange={(e) => setCodigoInterno(e.target.value)}
              margin="normal"
              required
              disabled={editando}
              multiline // Agrega esta línea para permitir múltiples líneas
            />
            <TextField
              fullWidth
              label="Código Proveedor"
              value={codigoProveedor}
              onChange={(e) => setCodigoProveedor(e.target.value)}
              margin="normal"
              required
              disabled={editando}
              multiline // Agrega esta línea para permitir múltiples líneas
            />
            <TextField
              fullWidth
              label="Categoría"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              margin="normal"
              required
              multiline // Agrega esta línea para permitir múltiples líneas
            />
            <TextField
              fullWidth
              label="Marca"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              margin="normal"
              required
              multiline // Agrega esta línea para permitir múltiples líneas
            />
            <TextField
              fullWidth
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              margin="normal"
              required
              multiline // Agrega esta línea para permitir múltiples líneas
              rows={3} // Puedes ajustar el número de líneas visibles por defecto
              style={{ width: '100%' }} // Agrega esta línea para que ocupe todo el ancho disponible
            />
            <TextField
              fullWidth
              label="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              margin="normal"
              required
              type="number"
            />
            <TextField
              fullWidth
              label="Ubicación"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              margin="normal"
              required
              multiline // Agrega esta línea para permitir múltiples líneas
            />
            {error && <Typography color="error">{error}</Typography>}
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button variant="contained" color="primary" type="submit">
                {editando ? 'Actualizar Producto' : 'Agregar Producto'}
              </Button>
              {editando && (
                <Button variant="contained" color="secondary" onClick={resetFormulario}>
                  Cancelar
                </Button>
              )}
            </Box>
          </form>
        </Box>
        <Box flexBasis="50%">
          <Typography variant="h5" component="h2" gutterBottom>
            Lista de Productos
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Buscar por</InputLabel>
            <Select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
              <MenuItem value="codigoInterno">Código Interno</MenuItem>
              <MenuItem value="codigoProveedor">Código Proveedor</MenuItem>
              <MenuItem value="categoria">Categoría</MenuItem>
              <MenuItem value="descripcion">Descripción</MenuItem>
              <MenuItem value="ubicacion">Ubicación</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label={`Buscar por ${searchBy}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            margin="normal"
          />        
          <TableContainer component={Paper} style={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Código Interno</TableCell>
                  <TableCell>Código Proveedor</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Marca</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Ubicación</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productosFiltrados.length > 0 ? (
                  productosFiltrados.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell>{producto.codigoInterno}</TableCell>
                      <TableCell>{producto.proveedores ? producto.proveedores.join(', ') : ''}</TableCell>
                      <TableCell>{producto.categoria}</TableCell>
                      <TableCell>{producto.marca}</TableCell>
                      <TableCell>{producto.descripcion}</TableCell>
                      <TableCell>{producto.stock}</TableCell>
                      <TableCell>{producto.ubicacion}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => seleccionarProducto(producto)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleClickOpen(producto.id)} color="secondary">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8}>No se encontraron productos</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este producto?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={eliminarProducto} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RegistrarProducto;
