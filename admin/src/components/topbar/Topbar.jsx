import React from "react";
import "./topbar.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/userRedux";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("persist:root");
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">EliteAdmin</span>
        </div>
        <div className="topRight">
          {user ? (
            <button className="topbarButton" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="topbarButton" onClick={handleLogin}>
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
