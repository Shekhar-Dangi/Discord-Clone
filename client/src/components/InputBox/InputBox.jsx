import styles from "./InputBox.module.css";

export default function InputBox({ placeholder, inputStyles = {} }) {
  return (
    <input
      placeholder={placeholder}
      type="text"
      name="textValue"
      className={styles.inputBox}
      style={inputStyles}
    ></input>
  );
}
