import styles from "./ProfileHeader.module.css";

export default function ProfileHeader({ username, avatar }) {
  return (
    <div className={styles.header}>
      <div className={styles.username}>
        <img className="avatar" src={avatar} alt="Profile Avatar" />
        {username &&
          username.slice(0, 7) +
            `${username && username.length > 7 ? "..." : ""}`}
      </div>
      <i class="fa-solid fa-gear"></i>
    </div>
  );
}
