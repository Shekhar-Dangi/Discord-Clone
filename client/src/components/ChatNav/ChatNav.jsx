import styles from "./ChatNav.module.css";
import InputBox from "../InputBox/InputBox";
import Modal from "../Modal/Modal";
import Profile from "../Profile/Profile";
import { useState } from "react";
export default function ChatNav({ profile, avatars }) {
  const inputStyles = { width: "auto" };
  const [modalVisibility, setModalVisibility] = useState(false);
  return (
    <>
      <div className={styles.container}>
        <Modal
          component={Profile}
          user={profile}
          modalVisibility={modalVisibility}
          setModalVisibility={setModalVisibility}
        />
        <div
          onClick={() => setModalVisibility((prev) => !prev)}
          className={styles.cTop}
        >
          <img className="avatar" src={profile.avatar}></img>
          <div className={styles.c1}>
            {"username" in profile ? profile.username : profile.name}
          </div>
        </div>
        <div className={styles.c2}>
          {avatars.map((avatar) => (
            <i className={avatar} />
          ))}
          <InputBox inputStyles={inputStyles} placeholder="search" />
          <i className={`fa-solid fa-magnifying-glass ${styles.setSearch}`}></i>
        </div>
      </div>
    </>
  );
}
