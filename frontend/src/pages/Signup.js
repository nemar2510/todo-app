import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await API.post("/auth/signup", {
        email,
        password
      });

      alert("Signup successful! Please login.");
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
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
        <h2>Signup</h2>

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
          onClick={handleSignup}
          style={{
            width: "100%",
            padding: "10px",
            background: "green",
            color: "white",
            border: "none"
          }}
        >
          Signup
        </button>

        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;