import React, { useContext } from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { FavoriteBorder, Favorite, Star, ShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { products } from '../data/products';

const Home = () => {
  const { addToCart } = useContext(CartContext);
  const [favorites, setFavorites] = React.useState({});

  const toggleFavorite = (productId) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const categories = [
    { 
      name: '💊 Medicines', 
      description: 'Crop disease treatments and pesticides', 
      color: '#ff6b6b',
      bgImage: 'https://images.unsplash.com/photo-1584308666744-24d5f400f628?w=400&h=400&fit=crop',
      icon: '💊'
    },
    { 
      name: '🌱 Fertilizers', 
      description: 'Nutrients for healthy plant growth', 
      color: '#74b9ff',
      bgImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=400&fit=crop',
      icon: '🌱'
    },
    { 
      name: '🍎 Fruits', 
      description: 'Fresh, high-quality fruits', 
      color: '#fdcb6e',
      bgImage: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd5e1b8?w=400&h=400&fit=crop',
      icon: '🍎'
    },
    { 
      name: '🥬 Vegetables', 
      description: 'Premium vegetables for your farm', 
      color: '#55efc4',
      bgImage: 'https://images.unsplash.com/photo-1566781857292-0a66db57a42e?w=400&h=400&fit=crop',
      icon: '🥬'
    },
    { 
      name: '🌾 Seeds', 
      description: 'High-yield seeds for better harvests', 
      color: '#a29bfe',
      bgImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=400&fit=crop',
      icon: '🌾'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 50%, #81c784 100%)',
          color: 'white',
          py: 10,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            pointerEvents: 'none',
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', md: '3.5rem' } }}>
            🌾 Welcome to AgriEcommerce
          </Typography>
          <Typography variant="h5" paragraph sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, mb: 3 }}>
            Your trusted source for premium agricultural products and supplies.
            Grow better with our quality medicines, fertilizers, seeds, and fresh produce.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/products"
            sx={{
              mt: 2,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
              }
            }}
          >
            🛒 Shop Now
          </Button>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box 
        sx={{ 
          bgcolor: '#ffffff', 
          py: 10,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(46, 125, 50, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: '#1b5e20',
              mb: 1,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            📦 Browse by Category
          </Typography>
          <Box sx={{ height: '4px', width: '80px', bgcolor: '#4caf50', mx: 'auto', mb: 3, borderRadius: '2px' }} />
          <Typography 
            variant="body1" 
            align="center" 
            color="text.secondary" 
            sx={{ mb: 6, fontSize: '1.1rem' }}
          >
            Find exactly what you need for your farm
          </Typography>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                <Card
                  component={Link}
                  to="/products"
                  sx={{
                    height: '280px',
                    background: `linear-gradient(135deg, ${category.color}ff 0%, ${category.color}dd 50%, ${category.color}aa 100%)`,
                    color: 'white',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    display: 'block',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '-50%',
                      right: '-50%',
                      width: '200%',
                      height: '200%',
                      background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)`,
                      transition: 'all 0.4s',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '100%',
                      background: `url('${category.bgImage}') center/cover`,
                      opacity: 0.15,
                      transition: 'opacity 0.4s',
                    },
                    '&:hover': {
                      transform: 'perspective(1000px) rotateX(10deg) rotateY(-5deg) translateY(-12px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
                      '&::before': {
                        top: '-25%',
                        right: '-25%',
                      },
                      '&::after': {
                        opacity: 0.25,
                      }
                    }
                  }}
                >
                  <CardContent 
                    sx={{ 
                      textAlign: 'center', 
                      py: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    <Box sx={{ fontSize: '3.5rem', mb: 2 }}>{category.icon}</Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 'bold', 
                        fontSize: '1.2rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {category.name.split(' ').slice(1).join(' ')}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '0.85rem', 
                        opacity: 0.95,
                        fontWeight: '500',
                        textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                        lineHeight: 1.4
                      }}
                    >
                      {category.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
