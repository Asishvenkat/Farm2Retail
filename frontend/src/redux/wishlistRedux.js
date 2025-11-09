// redux/wishlistRedux.js
import { createSlice } from "@reduxjs/toolkit";

// Load wishlist from localStorage on app start
const loadWishlistFromStorage = () => {
  try {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      return JSON.parse(savedWishlist);
    }
  } catch (error) {
    console.error('Error loading wishlist from localStorage:', error);
  }
  return {
    products: [],
    quantity: 0,
  };
};

// Save wishlist to localStorage
const saveWishlistToStorage = (state) => {
  try {
    localStorage.setItem('wishlist', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: loadWishlistFromStorage(),
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload;
      const existingItem = state.products.find(
        (product) => product._id === item._id
      );
      
      if (!existingItem) {
        state.products.push(item);
        state.quantity += 1;
        // Save to localStorage after state update
        saveWishlistToStorage(state);
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      const itemIndex = state.products.findIndex(
        (product) => product._id === productId
      );
      
      if (itemIndex !== -1) {
        state.products.splice(itemIndex, 1);
        state.quantity -= 1;
        // Save to localStorage after state update
        saveWishlistToStorage(state);
      }
    },
    clearWishlist: (state) => {
      state.products = [];
      state.quantity = 0;
      // Save to localStorage after state update
      saveWishlistToStorage(state);
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;