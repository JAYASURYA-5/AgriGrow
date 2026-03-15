import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import { Verified, GroupWork, Leaf, TrendingUp } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: <Verified fontSize="large" color="primary" />,
      title: 'Quality',
      description: 'We ensure all products meet the highest quality standards for your farm.'
    },
    {
      icon: <GroupWork fontSize="large" color="primary" />,
      title: 'Community',
      description: 'We support farmers and agricultural professionals with expert guidance.'
    },
    {
      icon: <Leaf fontSize="large" color="primary" />,
      title: 'Sustainability',
      description: 'We promote eco-friendly and sustainable agricultural practices.'
    },
    {
      icon: <TrendingUp fontSize="large" color="primary" />,
      title: 'Growth',
      description: 'We help farmers maximize their yields and grow their businesses.'
    }
  ];

  return (
    <Box>
      {/* About Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            About AgriEcommerce
          </Typography>
          <Typography variant="h6" paragraph align="center" sx={{ mt: 2 }}>
            Your Trusted Partner in Agricultural Excellence
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              At AgriEcommerce, we are dedicated to revolutionizing the agricultural supply chain. 
              We bridge the gap between farmers and quality agricultural products, making it easier 
              and more affordable for farmers to access the tools and supplies they need to succeed.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Our platform provides a comprehensive marketplace for medicines, fertilizers, seeds, 
              fresh produce, and vegetables. We work directly with verified suppliers to ensure 
              quality and reliability at every step.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: 'primary.light',
                p: 4,
                borderRadius: 2,
                textAlign: 'center'
              }}
            >
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                Since 2020
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Serving the agricultural community with excellence and integrity
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Values Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            Our Core Values
          </Typography>
          <Grid container spacing={3}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {value.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Why Choose AgriEcommerce?
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              ✓ Verified Suppliers
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              All our suppliers are carefully vetted to ensure quality and reliability.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              ✓ Competitive Pricing
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              We offer the best prices in the market without compromising on quality.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              ✓ Fast Delivery
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Quick and reliable shipping to get your products when you need them.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              ✓ Expert Support
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Our team of agricultural experts is ready to help you choose the right products.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Ready to Transform Your Farm?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            Join thousands of farmers who trust AgriEcommerce for their agricultural needs.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/products"
            sx={{ mt: 2, fontWeight: 'bold' }}
          >
            Start Shopping
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
