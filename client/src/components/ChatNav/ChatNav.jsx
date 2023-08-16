import styles from "./ChatNav.module.css";
import InputBox from "../InputBox/InputBox";
export default function ChatNav({ profile, avatars }) {
  const inputStyles = { width: "auto" };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.c1}>{profile.dName}</div>
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
