import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Topbar from "./components/topbar/Topbar.jsx";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import "./App.css";
import Home from "./pages/home/Home.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import UserList from "./pages/userList/UserList.jsx";
import ProductList from "./pages/productList/ProductList.jsx";
//import Product from "./pages/product/Product.jsx";

import Login from "./pages/login/Login.jsx";
import AllTransactions from "./pages/transactions/transactions.jsx";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // Get user from Redux store
  const currentUser = useSelector((state) => state.user.currentUser);

  // Check if user is in guest mode
  const isGuestMode = () => {
    try {
      const guestUser = localStorage.getItem("guestUser");
      return guestUser !== null;
    } catch {
      return false;
    }
  };

  // Authentication logic
  const isLoggedIn = currentUser !== null;
  const isAdmin = currentUser?.isAdmin || false;
  const isGuest = isGuestMode();

  // User has access if they're either admin or in guest mode
  const hasAccess = (isLoggedIn && isAdmin) || isGuest;

  return (
    <>
      {!isLoginPage && hasAccess && <Topbar />}
      <div className="container">
        {!isLoginPage && hasAccess && <Sidebar />}
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes - accessible for both admin and guest */}
          {hasAccess ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/products" element={<ProductList />} />
              {/* <Route path="/product/:productId" element={<Product />} /> */}

              <Route path="/transactions" element={<AllTransactions />} />
            </>
          ) : (
            // Redirect all other routes to login if not authenticated
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </div>
    </>
  );
}

export default App;
