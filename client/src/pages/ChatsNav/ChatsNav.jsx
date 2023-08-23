import { useEffect, useState } from "react";
import InfoBox from "../../components/InfoBox/InfoBox";
import InputBox from "../../components/InputBox/InputBox";
import stylesNav from "./ChatsNav.module.css";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";

export default function ChatsNav() {
  const { id } = useParams();
  const [disData, setDisData] = useState([]);
  const [url, setUrl] = useState("");
  // const [friends, setFriends] = useState([]);
  const fetchChannels = async () => {
    if (id !== "dm") {
      const response = await axios.get(
        `http://localhost:8000/api/guilds/${id}/channels`
      );
      setDisData(response.data);
      console.log(response.data);
      setUrl(`channels/`);
    } else {
      const response = await axios.get(
        `http://localhost:8000/api/members/64e0ded3f34ea84436cb8d0e`
      );
      console.log(response);
      setDisData(response.data.friends);
      setUrl(``);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [id]);

  return (
    <>
      <div
        className={`${stylesNav.width} ${stylesNav.backgroundChats} ${stylesNav.chatsNav}`}
      >
        {disData.map((data) => (
          <NavLink to={`${url}${data._id}`}>
            <InfoBox
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
