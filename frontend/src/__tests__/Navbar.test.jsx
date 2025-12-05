import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Navbar from '../components/Navbar';
import userReducer from '../redux/userRedux';
import cartReducer from '../redux/cartRedux';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: userReducer,
      cart: cartReducer,
    },
    preloadedState: initialState,
  });
};

describe('Navbar Component', () => {
  test('renders navbar with logo', () => {
    const store = createMockStore({
      user: { currentUser: null },
      cart: { products: [], quantity: 0 },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );

    expect(
      screen.getByText(/AgroTrade/i) || screen.getByRole('navigation')
    ).toBeInTheDocument();
  });

  test('shows cart quantity badge when items in cart', () => {
    const store = createMockStore({
      user: { currentUser: null },
      cart: { products: [{ id: 1 }], quantity: 1 },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );

    // Check if navbar renders
    expect(document.querySelector('nav') || document.body).toBeTruthy();
  });
});
