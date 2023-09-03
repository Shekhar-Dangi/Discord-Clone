import SvgIcon from "../SvgIcon/SvgICon";
import styles from "./InfoBox.module.css";

export default function InfoBox({ onClick, avatar, text, url }) {
  const isOnline = true;
  return (
    <>
      <div onClick={onClick} className={styles.info}>
        {url != null ? (
          <img className="profileImage" src={url}></img>
        ) : (
          <i class={avatar}></i>
        )}
        {isOnline ? (
          <i className={`${styles.online} fa-solid fa-circle`}></i>
        ) : (
          ""
        )}
        {text}
      </div>
    </>
  );
}
