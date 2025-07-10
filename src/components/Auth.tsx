import React, { useState } from "react";
import axios from "axios";

export const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");

  const handleLogin = async (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    try {
      const response = await axios.post("/api/token/", { username, password });
      setToken(response.data.access);
      setError("");
    } catch (err) {
      setError(`Invalid credentials: ${err}!`);
    }
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div>
      <h2>{token ? "Welcome!" : "Login"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!token ? (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <div>
          <p>You are logged in!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Auth;
