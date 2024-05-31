import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, addDoc, doc, updateDoc, increment } from '../firebase';
import { 
  Container, TextField, Button, Typography, Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper 
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import HomeIcon from '@mui/icons-material/Home';

const RegistrarVenta = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [codigoProveedor, setCodigoProveedor] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState(null);
  const [precioVentaFinal, setPrecioVentaFinal] = useState('');
  const [error, setError] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [criterioBusqueda, setCriterioBusqueda] = useState('codigoProveedor');
  const [filtro, setFiltro] = useState('');

  const obtenerProductos = async () => {
    const productosSnapshot = await getDocs(collection(db, 'productos'));
    const comprasSnapshot = await getDocs(collection(db, 'compras'));
    const productosList = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const comprasList = comprasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    productosList.forEach(producto => {
      const comprasProducto = comprasList.filter(compra => compra.codigoProveedor === producto.proveedores[0]);
      if (comprasProducto.length > 0) {
        const ultimaCompra = comprasProducto.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
        producto.ultimoPrecioVenta = ultimaCompra.precioVenta;
      } else {
        producto.ultimoPrecioVenta = 'N/A';
      }
    });

    productosList.sort((a, b) => a.codigoInterno.localeCompare(b.codigoInterno));
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

    try {
      await addDoc(collection(db, 'ventas'), {
        codigoProveedor: productoSeleccionado.proveedores[0],
        cantidad: parseInt(cantidad, 10),
        fecha: fecha.toISOString().split('T')[0],
        precioVentaFinal: parseFloat(precioVentaFinal),
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

  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setCodigoProveedor(producto.proveedores[0]);
    setError('');
  };

  const resetFormulario = () => {
    setCantidad('');
    setFecha(null);
    setPrecioVentaFinal('');
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
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Registrar Venta
      </Typography>
      <Button 
          variant="contained" 
          color="primary" 
          startIcon={<HomeIcon />} 
          onClick={() => window.location.href = '/home'}
          >
            Menú Principal
          </Button>
      <Box display="flex" justifyContent="space-between">
        <Box flexBasis="25%">
          <form onSubmit={(e) => { e.preventDefault(); registrarVenta(); }}>
            <TextField
              fullWidth
              label="Código Proveedor"
              value={codigoProveedor}
              readOnly
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              margin="normal"
              required
              type="number"
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha"
                value={fecha}
                onChange={(newValue) => setFecha(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
              />
            </LocalizationProvider>
            <TextField
              fullWidth
              label="Precio Venta Final"
              value={precioVentaFinal}
              onChange={(e) => setPrecioVentaFinal(e.target.value)}
              margin="normal"
              required
              type="number"
            />
            {error && <Typography color="error">{error}</Typography>}
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button variant="contained" color="primary" type="submit">
                Registrar Venta
              </Button>
              {productoSeleccionado && (
                <Button variant="contained" color="secondary" onClick={resetFormulario}>
                  Cancelar
                </Button>
              )}
            </Box>
          </form>
        
        </Box>
        <Box flexBasis="70%">
          <Typography variant="h5" component="h2" gutterBottom>
            Lista de Productos
          </Typography>
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid item>
                <Button variant={criterioBusqueda === 'codigoInterno' ? 'contained' : 'outlined'} onClick={() => setCriterioBusqueda('codigoInterno')}>
                  Código Interno
                </Button>
              </Grid>
              <Grid item>
                <Button variant={criterioBusqueda === 'codigoProveedor' ? 'contained' : 'outlined'} onClick={() => setCriterioBusqueda('codigoProveedor')}>
                  Código Proveedor
                </Button>
              </Grid>
              <Grid item>
                <Button variant={criterioBusqueda === 'categoria' ? 'contained' : 'outlined'} onClick={() => setCriterioBusqueda('categoria')}>
                  Categoría
                </Button>
              </Grid>
              <Grid item>
                <Button variant={criterioBusqueda === 'marca' ? 'contained' : 'outlined'} onClick={() => setCriterioBusqueda('marca')}>
                  Marca
                </Button>
              </Grid>
              <Grid item>
                <Button variant={criterioBusqueda === 'descripcion' ? 'contained' : 'outlined'} onClick={() => setCriterioBusqueda('descripcion')}>
                  Descripción
                </Button>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label={`Buscar por ${criterioBusqueda}`}
              value={filtro}
              onChange={buscarProducto}
              margin="normal"
            />
          </Box>
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
                  <TableCell>Precio Venta</TableCell>
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
                      <TableCell>{producto.ultimoPrecioVenta}</TableCell>
                      <TableCell>
                        <Button variant="contained" size="small" color="primary" onClick={() => seleccionarProducto(producto)}>
                          select
                        </Button>
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
    </Container>
  );
};

export default RegistrarVenta;
