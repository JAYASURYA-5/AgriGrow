import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment } from '@mui/material';
import { Search, FilterAlt } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';

const ProductList = ({ products, onAddToCart }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Set category from URL parameter on component mount
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      // Store category in localStorage for "Continue Shopping" buttons
      localStorage.setItem('lastCategory', categoryParam);
    }
  }, [categoryParam]);

  const categories = ['All', ...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 'bold',
            color: '#2e7d32',
            mb: 4,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          🌾 Our Premium Products
        </Typography>

        <Box
          sx={{
            mb: 4,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
            p: 3,
            bgcolor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        >
          <TextField
            label="🔍 Search products"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#2e7d32' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 250,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#2e7d32' },
                '&.Mui-focused fieldset': { borderColor: '#2e7d32' },
              },
            }}
          />

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel sx={{ color: '#2e7d32' }}>
              <FilterAlt sx={{ mr: 1, display: 'inline' }} />
              Category
            </InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#2e7d32' },
                },
              }}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {filteredProducts.length > 0 && (
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              mb: 2,
              fontWeight: '500',
              textAlign: 'center',
            }}
          >
            📦 Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </Typography>
        )}

        <Grid 
          container 
          spacing={3}
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
            width: '100%',
          }}
        >
          {filteredProducts.map((product, index) => (
            <Box
              key={product.id}
              sx={{
                animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                '@keyframes slideIn': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </Box>
          ))}
        </Grid>

        {filteredProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 2 }}>
              🔍 No products found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search or filter criteria to find what you're looking for.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProductList;
