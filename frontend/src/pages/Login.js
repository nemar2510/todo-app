import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      // ✅ Optional debug
      console.log("Token saved:", res.data.token);

      alert("Login successful");

      // ✅ Navigate immediately (no delay needed)
      navigate("/dashboard");

    } catch (err) {
      console.log(err.response);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg,#667eea,#764ba2)"
    }}>
      <div style={{
        width: "350px",
        padding: "20px",
        background: "white",
        borderRadius: "10px",
        textAlign: "center"
      }}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            background: "green",
            color: "white",
            border: "none"
          }}
        >
          Login
        </button>

        <p style={{ marginTop: "10px" }}>
          New user?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;