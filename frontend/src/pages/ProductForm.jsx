import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, createProduct, updateProduct } from '../api/products';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    inStock: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formLoading, setFormLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setFormLoading(true);
          const response = await getProductById(id);
          setProductData({
            ...response.data,
            price: response.data.price.toString(),
            stock: response.data.stock.toString(),
          });
          setFormLoading(false);
        } catch (err) {
          console.error('Failed to fetch product for editing:', err);
          setError(err.response?.data?.message || 'Failed to load product');
          setFormLoading(false);
          navigate('/products');
        }
      };
      fetchProduct();
    } else {
      setProductData({
        name: '',
        sku: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        inStock: true,
      });
      setFormLoading(false);
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const productToSend = {
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock, 10),
      };

      if (id) {
        await updateProduct(id, productToSend);
        setSuccess('Product updated successfully!');
      } else {
        await createProduct(productToSend);
        setSuccess('Product added successfully!');
        setProductData({
          name: '',
          sku: '',
          description: '',
          price: '',
          category: '',
          stock: '',
          inStock: true,
        });
      }
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err) {
      console.error(`${id ? 'Update' : 'Add'} product failed:`, err);
      setError(err.response?.data?.message || `Failed to ${id ? 'update' : 'add'} product`);
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 64px)">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px - 64px)', // Adjust for AppBar and Footer
        p: 3,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: '12px',
          width: '100%',
          maxWidth: '600px',
          border: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Typography variant="h4" component="h2" align="center" color="primary" fontWeight="bold" mb={4}>
          {id ? 'Edit Product' : 'Add New Product'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Product Name"
            name="name"
            value={productData.name}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
          <TextField
            label="SKU"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
          <TextField
            label="Description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={productData.price}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            inputProps={{ min: "0", step: "0.01" }}
          />
          <TextField
            label="Category"
            name="category"
            value={productData.category}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={productData.stock}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            inputProps={{ min: "0" }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={productData.inStock}
                onChange={handleChange}
                name="inStock"
                color="primary"
              />
            }
            label="In Stock"
            sx={{ alignSelf: 'flex-start' }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            startIcon={<SaveIcon />}
            sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '12px' }}
          >
            {loading ? (id ? 'Updating...' : 'Adding...') : (id ? 'Update Product' : 'Add Product')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default ProductForm;
