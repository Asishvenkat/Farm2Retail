// src/redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    products: [],
    quantity: 0, // Number of different product types
    totalQuantity: 0, // Total bulk quantity across all products
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      const existingIndex = state.products.findIndex(
        (product) => 
          product._id === action.payload._id &&
          product.size === action.payload.size &&
          product.color === action.payload.color
      );

      if (existingIndex >= 0) {
        // Update existing product - increase the bulk quantity but keep product count same
        const existingProduct = state.products[existingIndex];
        const oldTotal = existingProduct.price * existingProduct.quantity;
        
        existingProduct.quantity += action.payload.quantity;
        
        const newTotal = existingProduct.price * existingProduct.quantity;
        state.total = state.total - oldTotal + newTotal;
        state.totalQuantity += action.payload.quantity; // Add to total bulk quantity
        // quantity (product count) stays the same since we're just updating existing product
      } else {
        // Add new product
        state.products.push(action.payload);
        state.quantity += 1; // Increment product count by 1
        state.totalQuantity += action.payload.quantity; // Add to total bulk quantity
        state.total += action.payload.price * action.payload.quantity;
      }
    },

    increaseQuantity: (state, action) => {
      const product = state.products.find(p => 
        p._id === action.payload.id &&
        p.size === action.payload.size &&
        p.color === action.payload.color
      );
      
      if (product) {
        // Use the bulkQuantity from action payload or fallback to product's bulkQuantity or 1
        const bulkQuantity = action.payload.bulkQuantity || product.bulkQuantity || 1;
        product.quantity += bulkQuantity;
        state.total += product.price * bulkQuantity;
        state.totalQuantity += bulkQuantity; // Add to total bulk quantity
        // Product count (state.quantity) stays the same - we're just increasing bulk quantity
      }
    },

    decreaseQuantity: (state, action) => {
      const productIndex = state.products.findIndex(p => 
        p._id === action.payload.id &&
        p.size === action.payload.size &&
        p.color === action.payload.color
      );
      
      if (productIndex >= 0) {
        const product = state.products[productIndex];
        // Use the bulkQuantity from action payload or fallback to product's bulkQuantity or 1
        const bulkQuantity = action.payload.bulkQuantity || product.bulkQuantity || 1;
        
        if (product.quantity > bulkQuantity) {
          // Decrease by the bulk quantity amount
          product.quantity -= bulkQuantity;
          state.total -= product.price * bulkQuantity;
          state.totalQuantity -= bulkQuantity; // Subtract from total bulk quantity
          // Product count (state.quantity) stays the same
        } else {
          // Remove item completely if quantity would become 0 or negative
          state.quantity -= 1; // Decrease product count by 1
          state.totalQuantity -= product.quantity; // Subtract remaining quantity
          state.total -= product.price * product.quantity;
          state.products.splice(productIndex, 1);
        }
      }
    },

    removeProduct: (state, action) => {
      const productIndex = state.products.findIndex(p => 
        p._id === action.payload.id &&
        p.size === action.payload.size &&
        p.color === action.payload.color
      );
      
      if (productIndex >= 0) {
        const product = state.products[productIndex];
        state.quantity -= 1; // Decrease product count by 1
        state.totalQuantity -= product.quantity; // Subtract from total bulk quantity
        state.total -= product.price * product.quantity;
        state.products.splice(productIndex, 1);
      }
    },

    clearCart: (state) => {
      state.products = [];
      state.quantity = 0;
      state.totalQuantity = 0;
      state.total = 0;
    },
  },
});

export const {
  addProduct,
  increaseQuantity,
  decreaseQuantity,
  removeProduct,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;