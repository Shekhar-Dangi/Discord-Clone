import { Link } from "react-router-dom";
import styles from "./Auth.module.css";

export default function AuthS() {
  return (
    <>
      <div class={styles.loginContainer}>
        <h1>Create Your Account</h1>
        <form class={styles.signupForm}>
          <label for="username">Username:</label>
          <input
            className={styles.authInp}
            type="text"
            id="username"
            name="username"
            placeholder="Choose a username"
            required
          />

          <label for="email">Email:</label>
          <input
            className={styles.authInp}
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
          />

          <label for="password">Password:</label>
          <input
            className={styles.authInp}
            type="password"
            id="password"
            name="password"
            placeholder="Create a password"
            required
          />

          <button className={styles.authBtn} type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
}
