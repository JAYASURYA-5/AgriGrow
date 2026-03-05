import React from 'react';
import { Container, Grid, Typography, Box, Button, Rating, Chip } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

const ProductDetail = ({ product, onAddToCart }) => {
  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="text.secondary" align="center">
          Product not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: 400,
              objectFit: 'cover',
              borderRadius: 2,
            }}
            src={product.image}
            alt={product.name}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} readOnly precision={0.1} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.reviews} reviews)
            </Typography>
          </Box>

          <Chip label={product.category} color="primary" sx={{ mb: 2 }} />

          <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
            ₹{product.price.toFixed(2)}
          </Typography>

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Stock: {product.stock} available
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCart />}
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            sx={{ mr: 2 }}
          >
            Add to Cart
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
