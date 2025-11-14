import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { deleteProduct } from '../api/products';
import {
  Box,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  // Removed TablePagination
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // Removed page and rowsPerPage states
  const theme = useTheme();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/products', { params: { search: searchTerm } }); // Removed page and limit params
      setProducts(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]); // Removed page and rowsPerPage from dependency array

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(prevProducts => prevProducts.filter(product => product._id !== id));
        setError(null);
      } catch (err) {
        console.error('Failed to delete product:', err);
        setError(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // Removed setPage(0)
  };

  // Removed handleChangePage and handleChangeRowsPerPage functions

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 64px)">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: '800px', mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h4" component="h2" color="primary" fontWeight="bold">
          Products
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: { xs: '100%', sm: '250px' } }}
          />
          <Button 
            component={RouterLink} 
            to="/products/add" 
            variant="contained" 
            startIcon={<AddIcon />} 
            color="secondary"
            sx={{ textTransform: 'none', px: 3, py: 1, fontSize: '1rem', minWidth: { xs: '100%', sm: 'auto' } }}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%', maxWidth: '800px' }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden', width: '100%', maxWidth: '800px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="products table">
          <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>SKU</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>No products found.</TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow 
                  key={product._id} 
                  hover
                  sx={{
                    bgcolor: index % 2 === 0 ? 'background.paper' : theme.palette.grey[50],
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell>
                    <RouterLink to={`/products/${product._id}`} style={{ textDecoration: 'none', color: theme.palette.primary.main, fontWeight: 'medium' }}>
                      {product.name}
                    </RouterLink>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Button 
                      component={RouterLink} 
                      to={`/products/edit/${product._id}`} 
                      variant="outlined" 
                      startIcon={<EditIcon />} 
                      size="small" 
                      sx={{ mr: 1, textTransform: 'none', borderRadius: '8px' }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<DeleteIcon />} 
                      size="small" 
                      color="error" 
                      onClick={() => handleDeleteProduct(product._id)}
                      sx={{ textTransform: 'none', borderRadius: '8px' }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Removed TablePagination */}
      </TableContainer>
    </Box>
  );
}

export default Products;
