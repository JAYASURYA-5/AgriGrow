import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Box, Rating, Chip } from '@mui/material';
import { ShoppingCart, FavoriteBorder, Favorite } from '@mui/icons-material';
import { useState } from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(46, 125, 50, 0.15)',
          borderColor: '#2e7d32',
        },
      }}
    >
      {/* Image Container */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#f5f5f5',
        }}
      >
        <CardMedia
          component="img"
          height="280"
          image={product.image}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.4s ease-in-out',
            '&:hover': {
              transform: 'scale(1.08)',
            },
          }}
        />
        {/* Favorite Button */}
        <Button
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: 'rgba(255,255,255,0.9)',
            borderRadius: '50%',
            minWidth: 40,
            minHeight: 40,
            padding: 0,
            transition: 'all 0.3s',
            '&:hover': {
              bgcolor: '#ff5722',
              color: 'white',
            }
          }}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          {isFavorite ? <Favorite /> : <FavoriteBorder />}
        </Button>
        {/* Stock Badge */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            bgcolor: product.stock > 0 ? '#4caf50' : '#f44336',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          {product.stock > 0 ? `${product.stock} Left` : 'Out of Stock'}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              flex: 1,
              fontWeight: '700',
              fontSize: '1.1rem',
              color: '#1b5e20',
              mb: 0.5,
            }}
          >
            {product.name}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 0.5 }}>
          <Rating value={product.rating} readOnly precision={0.1} size="small" sx={{ color: '#ff9800' }} />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: '0.8rem',
              fontWeight: '600',
              bgcolor: '#f5f5f5',
              px: 1,
              py: 0.25,
              borderRadius: '4px',
            }}
          >
            {product.rating} ({product.reviews})
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            minHeight: 40,
            lineHeight: '1.4',
            fontSize: '0.85rem',
          }}
        >
          {product.description.length > 75
            ? product.description.substring(0, 75) + '...'
            : product.description}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            bgcolor: '#f0f7f0',
            borderRadius: '8px',
            border: '2px solid #2e7d32',
          }}
        >
          <Typography
            variant="h5"
            color="primary"
            sx={{
              fontWeight: 'bold',
              fontSize: '1.4rem',
              color: '#2e7d32',
            }}
          >
            ₹{product.price}
          </Typography>
          <Chip label={product.category} size="small" color="primary" sx={{ fontWeight: 'bold' }} />
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0 }}>
        <Button
          variant="contained"
          size="medium"
          fullWidth
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          sx={{
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2e7d32 30%, #66bb6a 90%)',
            boxShadow: '0 3px 5px rgba(46, 125, 50, 0.2)',
            transition: 'all 0.3s',
            '&:hover:not(:disabled)': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(46, 125, 50, 0.3)',
            },
          }}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
