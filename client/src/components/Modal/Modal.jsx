import styles from "./Modal.module.css";

export default function Modal({
  mStyles,
  component: Component,
  modalVisibility,
  setModalVisibility,
  onOpened,
  onClosed,
  heading,
  user,
  channel,
  id,
  value,
  setValue,
  form,
  onSubmit,
}) {
  return (
    <div
      className={
        modalVisibility
          ? `${styles.modalOverlay} ${styles.visible}`
          : styles.notVisible
      }
    >
      <div
        className={`${modalVisibility ? styles.visible : styles.notVisible} ${
          styles.modal
        } `}
        style={mStyles}
      >
        <i
          onClick={() => setModalVisibility(!modalVisibility)}
          className={`${styles.cross} fa-solid fa-xmark`}
        ></i>
        <div className={styles.heading}>{heading}</div>
        {form ? (
          <form onSubmit={onSubmit}>
            {" "}
            <Component
              value={value}
              setValue={setValue}
              id={id}
              channel={channel}
              user={user}
            />
          </form>
        ) : (
          <Component id={id} channel={channel} user={user} />
        )}
      </div>
    </div>
  );
}
