import InfoBox from "../../components/InfoBox/InfoBox";
import InputBox from "../../components/InputBox/InputBox";
import stylesNav from "./ChatsNav.module.css";

export default function ChatsNav() {
  return (
    <>
      <div
        className={`${stylesNav.width} ${stylesNav.backgroundChats} ${stylesNav.chatsNav}`}
      >
        <InputBox placeholder="Find or start a conversation" />
        <InfoBox avatar="fa-solid fa-user-group" text="Student" />
        <InfoBox
          url="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
          text="Random"
        />
      </div>
    </>
  );
}
