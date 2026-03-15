import React from 'react';
import { Box, Typography, Container, Grid, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-evenly">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              AgriEcommerce
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your trusted source for agricultural products and supplies.
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Products
            </Typography>
            <Link href="#" variant="body2" color="text.secondary" display="block">
              Medicines
            </Link>
            <Link href="#" variant="body2" color="text.secondary" display="block">
              Fertilizers
            </Link>
            <Link href="#" variant="body2" color="text.secondary" display="block">
              Fruits
            </Link>
            <Link href="#" variant="body2" color="text.secondary" display="block">
              Vegetables
            </Link>
            <Link href="#" variant="body2" color="text.secondary" display="block">
              Seeds
            </Link>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Company
            </Typography>
            <Link href="#" variant="body2" color="text.secondary" display="block">
              About Us
            </Link>
            <Link href="#" variant="body2" color="text.secondary" display="block">
              Contact
            </Link>
            <Link href="#" variant="body2" color="text.secondary" display="block">
              Support
            </Link>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
              AgriEcommerce
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
