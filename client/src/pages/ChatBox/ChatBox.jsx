import { Form, useParams } from "react-router-dom";
import ChatNav from "../../components/ChatNav/ChatNav";
import InputBox from "../../components/InputBox/InputBox";
import stylesNav from "./ChatBox.module.css";
import { useEffect, useState } from "react";
import axiosInstance from "../../axios-config";

export default function ChatBox() {
  let params = useParams();
  console.log("called");
  const [data, setData] = useState({});
  let avatars = [
    "fa-solid fa-phone",
    "fa-solid fa-video",
    "fa-solid fa-thumbtack",
    "fa-solid fa-plus",
    "fa-solid fa-inbox",
  ];

  const fetchData = async () => {
    let isUser = "uId" in params;
    console.log(isUser);
    if (isUser) {
      const res = await axiosInstance.get(`/api/members/${params.uId}`);
      setData(res.data);
      console.log(res.data);
    } else {
      const res = await axiosInstance.get(
        `/api/guilds/${params.id}/channels/${params.cId}`
      );
      setData(res.data);
    }
    console.log(data);
  };
  useEffect(() => {
    fetchData();
  }, [params]);
  return (
    <>
      <div className={`${stylesNav.flexWidth} ${stylesNav.backChatBox}`}>
        <ChatNav
          profile={{ dName: "name" in data ? data.name : data.username }}
          avatars={avatars}
        />
        <form>
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
