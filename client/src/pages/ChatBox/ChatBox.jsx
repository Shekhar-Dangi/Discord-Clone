import ChatNav from "../../components/ChatNav/ChatNav";
import InputBox from "../../components/InputBox/InputBox";
import stylesNav from "./ChatBox.module.css";

export default function ChatBox() {
  let avatars = [
    "fa-solid fa-phone",
    "fa-solid fa-video",
    "fa-solid fa-thumbtack",
    "fa-solid fa-plus",
    "fa-solid fa-inbox",
  ];
  return (
    <>
      <div className={`${stylesNav.flexWidth} ${stylesNav.backChatBox}`}>
        <ChatNav profile={{ dName: "Shekhar" }} avatars={avatars} />
      </div>
    </>
  );
}
