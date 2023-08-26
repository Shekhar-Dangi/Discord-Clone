import { useEffect, useState } from "react";
import styles from "./Auth.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AuthL({ isAuthenticate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [key, setKey] = useState(1);
  useEffect(() => {
    if (isAuthenticate) navigate("/");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      window.location.reload();
      // const refresh = setInterval(() => {
      //   navigate("/");
      //   if (window.location.href != "http://localhost:3000/auth") {
      //     clearInterval(refresh);
      //   }
      // });
      // setKey((k) => {
      //   return k + 1;
      // });
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1>Welcome to Discord Clone</h1>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <label htmlFor="username">Username:</label>
        <input
          className={styles.authInp}
          type="text"
          id="username"
          name="username"
          value={username}
          placeholder="Enter your username"
          required
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />

        <label htmlFor="password">Password:</label>
        <input
          className={styles.authInp}
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
        />
        <p>{error}</p>
        <button className={styles.authBtn} type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
