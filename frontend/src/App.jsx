import './App.css';
import Cart from './Pages/retailers/Cart';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Wishlist from './Pages/retailers/wishlist';
import Orders from './Pages/retailers/orders';
import Messages from './Pages/Messages';
import ScrollToTop from './components/scroll';
import AddProduct from './Pages/farmers/add';
import ViewProducts from './Pages/farmers/products';
import UpdateProduct from './Pages/farmers/update';
import FarmerOrders from './Pages/farmers/orders';
import Products from './Pages/retailers/Products';
import Product from './Pages/retailers/product';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

function App() {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/farmer/products" element={<ViewProducts />} />
        <Route path="/farmer/add-product" element={<AddProduct />} />
        <Route path="/farmer/orders" element={<FarmerOrders />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/update-product/:id" element={<UpdateProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
