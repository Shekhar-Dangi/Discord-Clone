import { Form, useParams } from "react-router-dom";
import ChatNav from "../../components/ChatNav/ChatNav";
import InputBox from "../../components/InputBox/InputBox";
import stylesNav from "./ChatBox.module.css";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../axios-config";
import socketController from "../../sockets/socket-controller";
import Message from "../../components/Message/Message";

export default function ChatBox({ user }) {
  let params = useParams();
  const messagesContainerRef = useRef(null);
  function downScroll() {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight + 2000;
    }
  }
  const defaultAvatar =
    "https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?w=1480&t=st=1693148486~exp=1693149086~hmac=19c31c3babe6136a9b3de98f67b301e5f68bda89a093e5f54abeb211e5b6bfcd";
  const socketInstanceRef = useRef(null);
  let isUser = "uId" in params;
  const [data, setData] = useState({});
  const [messages, setMessages] = useState([]);
  let avatars = [
    "fa-solid fa-phone",
    "fa-solid fa-video",
    "fa-solid fa-thumbtack",
    "fa-solid fa-plus",
    "fa-solid fa-inbox",
  ];
  const sendMessage = (e) => {
    e.preventDefault();
    if ("_id" in user) {
      socketInstanceRef.current.emit("message", {
        sender: user._id,
        recipientType: "uId" in params ? "user" : "channel",
        recipientId: isUser ? params.uId : params.cId,
        content: e.target[0].value,
      });
    }

    e.target[0].value = "";
  };
  const fetchData = async () => {
    if ("_id" in user) {
      const res2 = await axiosInstance.get(
        `/api/message/load/${user._id}/${isUser ? params.uId : params.cId}/${
          isUser ? 0 : 1
        }`
      );
      setMessages(res2.data);
    }
    if (isUser) {
      const res = await axiosInstance.get(`/api/members/${params.uId}`);
      setData(res.data);
    } else {
      const res = await axiosInstance.get(
        `/api/guilds/${params.id}/channels/${params.cId}`
      );
      setData(res.data);
    }
    downScroll();
  };

  useEffect(() => {
    fetchData();

    const { socket, disconnect } = socketController();
    if (user && isUser) {
      socket.emit("joinRoom", user._id);
    } else if (user) {
      socket.emit("joinRoom", params.cId);
    }
    socketInstanceRef.current = socket;
    socket.on("addMessage", async (response) => {
      console.log(response);
      setMessages((prevMessages) => [...prevMessages, response]);
      setTimeout(downScroll, 300);
    });
    return () => {
      disconnect();
    };
  }, [params, user]);
  return (
    <>
      <div className={`${stylesNav.flexWidth} ${stylesNav.backChatBox}`}>
        <ChatNav
          profile={{ dName: "name" in data ? data.name : data.username }}
          avatars={avatars}
        />
        <div ref={messagesContainerRef} className={stylesNav.chatMessages}>
          {messages.map((message) => (
            <Message
              text={message.content}
              avatar={
                "avatar" in message.sender
                  ? message.sender.avatar
                  : defaultAvatar
              }
              author={message.sender.username}
            />
          ))}
        </div>

        <form onSubmit={sendMessage}>
          <div className={stylesNav.chatFooter}>
            <InputBox
              inputStyles={{ "background-color": "#383a40", padding: "13px" }}
            />
          </div>
        </form>
      </div>
    </>
  );
}
