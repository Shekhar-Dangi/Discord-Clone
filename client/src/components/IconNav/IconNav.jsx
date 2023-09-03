import styles from "./IconNav.module.css";
import DMIcon from "../DMIcon/DMIcon";
import { Link } from "react-router-dom";

export default function IconNav({ dm, id, disName, onClick }) {
  return (
    <>
      {dm ? (
        <div onClick={onClick} className={`${styles.icon}`}>
          <DMIcon />
        </div>
      ) : (
        <div
          onClick={onClick}
          className={`${styles.server} ${styles.icon}`}
          key={id}
        >
          {disName}
        </div>
      )}
    </>
  );
}
