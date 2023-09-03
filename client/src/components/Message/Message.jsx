import styles from "./Message.module.css";

export default function Message({
  avatar,
  author,
  text,
  editMessage,
  id,
  deleteMessage,
}) {
  return (
    <>
      <div class={styles.message}>
        <div className={styles.messageAction}>
          <i onClick={() => editMessage(id)} class="fa-solid fa-pen"></i>
          <i onClick={() => deleteMessage(id)} class="fa-solid fa-trash"></i>
        </div>
        <img className="avatar" src={avatar} alt="User Avatar" />
        <div className={styles.sideMessage}>
          <div className={styles.messageContent}>{author}</div>
          <div className={styles.messageText}>{text}</div>
        </div>
      </div>
    </>
  );
}
