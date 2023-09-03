import styles from "./Profile.module.css";
export default function Profile({ user }) {
  return (
    <div className={styles.container}>
      <img src={user.avatar} className={styles.avatar}></img>
      <div className={styles.displayRow}>
        <i class={`${styles.colBlue} fa-solid fa-hashtag`}></i>
        <div className="colBlack">{user.username || user.name}</div>
      </div>
    </div>
  );
}
