import styles from "./InputBox.module.css";

export default function InputBox({
  placeholder,
  inputStyles = {},
  value,
  setValue,
}) {
  return (
    <input
      placeholder={placeholder}
      type="text"
      name="textValue"
      className={styles.inputBox}
      style={inputStyles}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    ></input>
  );
}
