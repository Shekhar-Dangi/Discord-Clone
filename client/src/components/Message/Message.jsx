import styles from "./Message.module.css";

export default function Message({ avatar, author, text }) {
  return (
    <>
      <div class={styles.message}>
        <img className="avatar" src={avatar} alt="User Avatar" />
        <div className={styles.sideMessage}>
          <div className={styles.messageContent}>{author}</div>

          <div className={styles.messageText}>{text}</div>
        </div>
      </div>
    </>
  );
}
