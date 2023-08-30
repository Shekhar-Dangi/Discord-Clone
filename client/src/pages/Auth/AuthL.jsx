import { useEffect, useState } from "react";
import styles from "./Auth.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthS from "./AuthS";

export default function AuthL({ isAuthenticate }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [login, setLogin] = useState(true);
  const navigate = useNavigate();
  const [key, setKey] = useState(1);
  useEffect(() => {
    if (isAuthenticate) navigate("/");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("haha");
    try {
      if (login) {
        const { data } = await axios.post(
          "http://localhost:8000/api/login",
          {
            username,
            password,
          },
          { withCredentials: true }
        );
      } else {
        const { data } = await axios.post(
          "http://localhost:8000/api/members",
          {
            username,
            password,
            email,
          },
          { withCredentials: true }
        );
        console.log(data);
      }
      window.location.reload();
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  return login ? (
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

        <button className={styles.authBtn} type="submit">
          Login
        </button>

        <a
          className={styles.authBtn}
          type="button"
          onClick={(e) => {
            setLogin(false);
          }}
        >
          New User ? Register
        </a>
      </form>
    </div>
  ) : (
    <>
      <div class={styles.loginContainer}>
        <h1>Create Your Account</h1>
        <form onSubmit={handleSubmit} class={styles.signupForm}>
          <label for="username">Username:</label>
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
          <label htmlFor="email">Email:</label>
          <input
            className={styles.authInp}
            type="email"
            id="email"
            name="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
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

          <button className={styles.authBtn} type="submit">
            Sign Up
          </button>
          <a
            className={styles.authBtn}
            onClick={(e) => {
              setLogin(true);
            }}
            type="button"
          >
            Have an account ? Login
          </a>
        </form>
      </div>
    </>
  );
}
