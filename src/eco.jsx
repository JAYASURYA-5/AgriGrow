import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CartProvider } from '../E---commerce-/src/context/CartContext';
import { OrderProvider } from '../E---commerce-/src/context/OrderContext';
import Header from '../E---commerce-/src/components/Header';
import Footer from '../E---commerce-/src/components/Footer';
import Home from '../E---commerce-/src/pages/Home';
import Products from '../E---commerce-/src/pages/Products';
import CartPage from '../E---commerce-/src/pages/CartPage';
import Checkout from '../E---commerce-/src/pages/Checkout';
import Orders from '../E---commerce-/src/pages/Orders';
import OrderDetails from '../E---commerce-/src/pages/OrderDetails';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green theme for agriculture
    },
    secondary: {
      main: '#ff9800', // Orange accent
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function Eco() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <OrderProvider>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:orderId" element={<OrderDetails />} />
            </Routes>
            <Footer />
          </div>
        </OrderProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default Eco;
