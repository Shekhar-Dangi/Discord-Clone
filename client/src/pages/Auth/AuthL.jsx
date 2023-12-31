import { useEffect, useState } from "react";
import styles from "./Auth.module.css";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";
import Background from "../../components/Background";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";
import { getTokenFromCookies } from "../../cookieUtil";

export default function AuthL({ setCookie, isAuthenticate, user }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookie, updateCookie] = useState("");
  const [file, setFile] = useState(null);
  const [login, setLogin] = useState(true);
  const navigate = useNavigate();
  const [key, setKey] = useState(1);

  useEffect(() => {
    if (cookie.length > 1) {
      console.log("navigated");
      redirect("/");
    }
  }, [cookie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("haha");
    try {
      if (login) {
        const { data } = await axios.post(
          "https://discord-server-hu1l.onrender.com/api/login",
          {
            username,
            password,
          },
          { withCredentials: true }
        );
        Cookies.set("token", data.token, { expires: 1 });
        setCookie(data.token);
        navigate("/");
      } else {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("email", email);
        formData.append("avatar", file);
        const { data } = await axios.post(
          "https://discord-server-hu1l.onrender.com/api/members",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        setCookie(data.token);
        navigate("/");
      }
      updateCookie(getTokenFromCookies());
    } catch (error) {
      console.log(error);
    }
  };

  return login ? (
    <>
      <Background />
      <div className={styles.loginContainer}>
        <h2>Welcome back!</h2>
        <p className="font14">We are so excited to see you again!</p>
        <form
          enctype="multipart/form-data"
          onSubmit={handleSubmit}
          className={styles.loginForm}
        >
          <label htmlFor="username">
            Username <span className={styles.asterisk}>*</span>
          </label>
          <input
            className={`authInp`}
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
          <label htmlFor="password">
            Password <span className={styles.asterisk}>*</span>
          </label>
          <input
            className={`authInp`}
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

          <button className="authBtn" type="submit">
            Login
          </button>
          <p className="font12">
            Need an account?{" "}
            <a
              onClick={() => {
                setLogin(false);
              }}
              className="link"
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </>
  ) : (
    <>
      <Background />
      <div class={styles.loginContainer}>
        <h1>Create Your Account</h1>
        <form onSubmit={handleSubmit} class={styles.signupForm}>
          <label for="username">
            Username: <span className={styles.asterisk}>*</span>
          </label>
          <input
            className={`authInp`}
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
          <label htmlFor="email">
            Email: <span className={styles.asterisk}>*</span>
          </label>
          <input
            className={`authInp`}
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

          <label htmlFor="password">
            Password: <span className={styles.asterisk}>*</span>
          </label>
          <input
            className={`authInp`}
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
          <label htmlFor="file">
            Profile Picture : <span className={styles.asterisk}>*</span>
          </label>
          <input
            type="file"
            name="file"
            className={styles.customInput}
            placeholder="Upload your image"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <button className="authBtn" type="submit">
            Sign Up
          </button>
          <p className="font12">
            Already a user?{" "}
            <a
              onClick={() => {
                setLogin(true);
              }}
              className="link"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </>
  );
}
