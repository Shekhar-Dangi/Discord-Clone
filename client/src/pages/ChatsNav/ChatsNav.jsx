import { useEffect, useState } from "react";
import InfoBox from "../../components/InfoBox/InfoBox";
import InputBox from "../../components/InputBox/InputBox";
import stylesNav from "./ChatsNav.module.css";
import { NavLink, useParams } from "react-router-dom";
import axiosInstance from "../../axios-config";
import getUser from "../../user-local";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";

export default function ChatsNav({ user }) {
  const defaultAvatar =
    "https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?w=1480&t=st=1693148486~exp=1693149086~hmac=19c31c3babe6136a9b3de98f67b301e5f68bda89a093e5f54abeb211e5b6bfcd";
  const { id } = useParams();
  const [disData, setDisData] = useState([]);
  const [url, setUrl] = useState("");
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
  }, [id, user]);

  return (
    <>
      <div
        className={`${stylesNav.width} ${stylesNav.backgroundChats} ${stylesNav.chatsNav}`}
      >
        <div>
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
        <ProfileHeader
          username={user.username}
          avatar={"avatar" in user ? user.avatar : defaultAvatar}
        />
      </div>
    </>
  );
}
