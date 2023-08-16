import SvgIcon from "../SvgIcon/SvgICon";
import styles from "./InfoBox.module.css";

export default function InfoBox({ avatar, text, url }) {
  const isOnline = true;
  return (
    <>
      <div className={styles.info}>
        {url ? (
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
