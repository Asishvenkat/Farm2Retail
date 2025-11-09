import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/apiCalls";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isFetching, currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?.isAdmin) navigate("/");
  }, [currentUser, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) return alert("Enter both fields");
    login(dispatch, { username, password });
  };

  const handleGuestMode = () => {
    const guestUser = {
      _id: 'guest_user_id',
      username: 'Guest User',
      isAdmin: false,
      isGuest: true,
      email: 'guest@example.com'
    };
    localStorage.setItem('guestUser', JSON.stringify(guestUser));
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
        <button onClick={handleLogin} style={styles.loginBtn}>{isFetching ? "Logging in..." : "Login as Admin"}</button>
        <div style={styles.or}>OR</div>
        <button onClick={handleGuestMode} style={styles.guestBtn}>Try Guest Mode</button>
        <p style={styles.note}>Guest mode allows you to explore the admin panel with view-only access.</p>
        {error && <div style={styles.error}>Login Failed</div>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh", width: "100vw", display: "flex",
    justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5"
  },
  card: {
    width: 300, padding: 30, background: "#fff", borderRadius: 10,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)", textAlign: "center"
  },
  title: { marginBottom: 20, color: "#333" },
  input: {
    width: "93%", padding: 10, marginBottom: 15, fontSize: 14,
    border: "1px solid #ccc", borderRadius: 5
  },
  loginBtn: {
    width: "100%", padding: 10, backgroundColor: "#007bff", color: "#fff",
    border: "none", borderRadius: 5, fontSize: 16, cursor: "pointer"
  },
  guestBtn: {
    width: "100%", padding: 10, backgroundColor: "#6c757d", color: "#fff",
    border: "none", borderRadius: 5, fontSize: 16, cursor: "pointer"
  },
  or: { margin: "15px 0", fontSize: 14, color: "#777" },
  note: { marginTop: 10, fontSize: 12, color: "#555" },
  error: { color: "red", marginTop: 10, fontSize: 14 }
};

export default Login;
