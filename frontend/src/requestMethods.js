import axios from 'axios';

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/';

// Safe token extraction
let TOKEN = null;
try {
  const persistedRoot = JSON.parse(localStorage.getItem('persist:root'));
  const user = persistedRoot ? JSON.parse(persistedRoot.user) : null;
  TOKEN = user?.currentUser?.accessToken;
} catch (err) {
  console.error('Token retrieval failed:', err);
}

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
});

if (TOKEN) {
  userRequest.defaults.headers.common['token'] = `Bearer ${TOKEN}`;
}
