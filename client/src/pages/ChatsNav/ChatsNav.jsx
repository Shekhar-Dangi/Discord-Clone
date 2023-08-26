import { useEffect, useState } from "react";
import InfoBox from "../../components/InfoBox/InfoBox";
import InputBox from "../../components/InputBox/InputBox";
import stylesNav from "./ChatsNav.module.css";
import { NavLink, useParams } from "react-router-dom";
import axiosInstance from "../../axios-config";
import getUser from "../../user-local";

export default function ChatsNav({ user }) {
  const { id } = useParams();
  const [disData, setDisData] = useState([]);
  const [url, setUrl] = useState("");
  // const [friends, setFriends] = useState([]);
  const fetchChannels = async () => {
    if (id !== "dm") {
      const response = await axiosInstance.get(`/api/guilds/${id}/channels`);
      setDisData(response.data);
      console.log(response.data);
      setUrl(`channels/`);
    } else {
      console.log(user, "fs");
      if (!!user && "_id" in user) {
        const response = await axiosInstance.get(`/api/members/${user._id}`);
        console.log("friends", response);
        setDisData(response.data.friends);
        setUrl(``);
      }
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  return (
    <>
      <div
        className={`${stylesNav.width} ${stylesNav.backgroundChats} ${stylesNav.chatsNav}`}
      >
        {disData.map((data) => (
          <NavLink key={data._id} to={`${url}${data._id}`}>
            <InfoBox
              id={data._id}
              avatar="fa-solid fa-hashtag"
              url={id === "dm" ? data.avatar : null}
              text={data.name || data.username}
            />
          </NavLink>
        ))}
      </div>
    </>
  );
}
