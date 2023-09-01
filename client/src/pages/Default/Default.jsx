import InputBox from "../../components/InputBox/InputBox";
import styles from "./Default.module.css";
import axiosInstance from "../../axios-config";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socketController from "../../sockets/socket-controller";
import { useEffect, useRef, useState } from "react";

export default function Default({ user }) {
  const notify = (message) => toast(message);
  const [requests, setRequests] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const socketRef = useRef(null);
  const sendRequest = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/api/friend/request", {
        username1: e.target[0].value.trim(),
        id2: user._id,
      });
      console.log(data);
      notify(data.message);
      socketRef.current.emit("newRequest", {
        id: user._id,
        recipientId: data.user1._id,
      });
    } catch (error) {
      console.log(error);
      // const text = error.req.responseText;
      notify(error.message);
    }
    e.target[0].value = "";
  };

  const acceptRequest = async (username) => {
    try {
      const { data } = await axiosInstance.post("/api/friend/new", {
        username1: username,
        id2: user._id,
      });
      await axiosInstance.post("/api/friend/request/remove", {
        username1: username,
        id2: user._id,
      });
      notify(data.message);
      setRequests((prev) => prev.filter((req) => req.username !== username));
    } catch (error) {
      console.log(error);
      const text = error.request.responseText;
      notify(text === "{}" ? error.message : text);
    }
  };
  useEffect(() => {
    console.log(user.requests);
    setRequests(user.requests);
    const { socket, disconnect } = socketController();

    socket.emit("joinRoom", user._id);

    socketRef.current = socket;
    socket.on("addReq", (data) => {
      setRequests((prev) => [...prev, data]);
      notify(`${data.username} sent you request!`);
    });
    return () => {
      disconnect();
    };
  }, [user]);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.topNav}>
          <i
            onClick={() => setShowNotif((prev) => !prev)}
            class="fa-solid fa-bell"
          ></i>
        </div>
        <div
          style={{ display: showNotif ? "flex" : "none" }}
          className={styles.box}
        >
          {requests && requests.length > 0
            ? requests.map((req) => (
                <div className={styles.request}>
                  <p>
                    <span className={styles.username}>{req.username}</span> sent
                    you a friend request
                  </p>
                  <button
                    onClick={() => {
                      acceptRequest(req.username);
                    }}
                    className={`authBtn ${styles.btn}`}
                  >
                    Accept
                  </button>
                  <button className={`authBtn ${styles.btn} ${styles.redBtn}`}>
                    Reject
                  </button>
                </div>
              ))
            : "No new request"}
        </div>
        <div className={styles.bContainer}>
          <h3 className={styles.heading}>Add Friend</h3>

          <ToastContainer theme="dark" />

          <p className={`font12 ${styles.desc}`}>
            You can add your friends with their Discord username
          </p>
          <form onSubmit={sendRequest}>
            <InputBox inputStyles={{ padding: "14px" }} />
            <button
              type="submit"
              className={`${styles.fixWidth} authBtn font14`}
            >
              Send Friend Request
            </button>
          </form>
          <div>
            <div className={styles.imgBack}></div>
          </div>
        </div>
      </div>
    </>
  );
}
