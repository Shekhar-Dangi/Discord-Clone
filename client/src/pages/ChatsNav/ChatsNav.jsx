import { useEffect, useState } from "react";
import InfoBox from "../../components/InfoBox/InfoBox";
import stylesNav from "./ChatsNav.module.css";
import { NavLink, useParams } from "react-router-dom";
import axiosInstance from "../../axios-config";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import { useSocket } from "../../SocketContext";
import Modal from "../../components/Modal/Modal";
import ServerForm from "../../components/ServerForm/FormSerOrChan";
import InputBox from "../../components/InputBox/InputBox";
import notify from "../../utils";
import { ToastContainer } from "react-toastify";
import Profile from "../../components/Profile/Profile";

export default function ChatsNav({ user }) {
  const defaultAvatar =
    "https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?w=1480&t=st=1693148486~exp=1693149086~hmac=19c31c3babe6136a9b3de98f67b301e5f68bda89a093e5f54abeb211e5b6bfcd";
  const { id } = useParams();
  const [disData, setDisData] = useState([]);
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const socket = useSocket();
  const addMember = async (e) => {
    e.preventDefault();
    try {
      console.log("Before");
      const res = await axiosInstance.post(`/api/guilds/newMember/${id}`, {
        username,
      });
      console.log(res);
      socket.emit("channelRequest", username);
      notify("Member added!");
    } catch (error) {
      notify(error.response.data.message);
    }
  };
  const [modalVisiblity, setModalVisiblity] = useState(false);
  const [modal2Visiblity, setModal2Visiblity] = useState(false);
  const [modal3Visiblity, setModal3Visiblity] = useState(false);
  const [again, setAgain] = useState(false);
  const fetchChannels = async () => {
    if (id !== "dm") {
      try {
        const response = await axiosInstance.get(`/api/guilds/${id}/channels`);
        setDisData(response.data);
        console.log(response.data);
        setUrl(`channels/`);
      } catch (error) {
        notify(error.response.data.message);
      }
    } else {
      console.log(user, "fs");
      try {
        if (!!user && "_id" in user) {
          const response = await axiosInstance.get(`/api/members/${user._id}`);
          console.log("friends", response);
          setDisData(response.data.friends);
          setUrl(``);
        }
      } catch (error) {
        notify(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    fetchChannels();
    socket &&
      !again &&
      socket.on("addChannel", async (channel) => {
        console.log("New channel");
        setDisData(channel);
        setAgain(true);
      });
  }, [id, user]);

  return (
    <>
      <ToastContainer theme="dark" />
      <div
        className={`${stylesNav.width} ${stylesNav.backgroundChats} ${stylesNav.chatsNav}`}
      >
        <Modal
          heading="Add a new Channel"
          component={ServerForm}
          modalVisibility={modalVisiblity}
          setModalVisibility={setModalVisiblity}
          user={user}
          channel={true}
          id={id}
        />
        <Modal
          heading="Add Member"
          component={InputBox}
          form={true}
          onSubmit={addMember}
          modalVisibility={modal2Visiblity}
          setModalVisibility={setModal2Visiblity}
          user={user}
          id={id}
          value={username}
          setValue={setUsername}
        />
        <div>
          {id !== "dm" ? (
            <>
              <InfoBox
                onClick={() => {
                  setModalVisiblity((prev) => !prev);
                }}
                avatar="fa-solid fa-plus"
                text="New Channel"
              />
              <InfoBox
                onClick={() => {
                  setModal2Visiblity((prev) => !prev);
                }}
                avatar="fa-solid fa-plus"
                text="Add Member"
              />
            </>
          ) : (
            ""
          )}

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
        <Modal
          modalVisibility={modal3Visiblity}
          setModalVisibility={setModal3Visiblity}
          component={Profile}
          user={user}
        />
        <ProfileHeader
          onClick={() => {
            setModal3Visiblity((prev) => !prev);
          }}
          username={user.username}
          avatar={"avatar" in user ? user.avatar : defaultAvatar}
        />
      </div>
    </>
  );
}
