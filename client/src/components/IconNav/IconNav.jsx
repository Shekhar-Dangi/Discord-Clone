import styles from "./IconNav.module.css";
import DMIcon from "../DMIcon/DMIcon";
import { Link } from "react-router-dom";

export default function IconNav({ dm, id, disName = "SS" }) {
  return (
    <>
      {dm ? (
        <div className={`${styles.icon}`}>
          <DMIcon />
        </div>
      ) : (
        <div className={`${styles.server} ${styles.icon}`} key={id}>
          {disName}
        </div>
      )}
    </>
  );
}
