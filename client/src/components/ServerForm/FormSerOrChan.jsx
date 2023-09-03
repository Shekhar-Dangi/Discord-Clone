import { useState } from "react";
import InputBox from "../InputBox/InputBox";
import axiosInstance from "../../axios-config";
import { useSocket } from "../../SocketContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ServerForm({ user, channel, id }) {
  const [serverName, setServerName] = useState("");
  const socket = useSocket();
  const [desc, setDesc] = useState("");
  const notify = (message) => toast(message);
  const handleChannel = async (e) => {
    e.preventDefault();
    const link = `/api/guilds/${id}/channels`;
    try {
      const { data } = await axiosInstance.post(link, {
        name: serverName,
        description: desc,
      });
      setDesc("");
      setServerName("");
      socket.emit("newChannel", data);
    } catch (error) {
      notify(error.message);
    }
  };
  const handleServer = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/api/guilds", {
        name: serverName,
        description: desc,
        members: [user.id],
      });
      setDesc("");
      setServerName("");
      socket.emit("newServer", data);
    } catch (error) {
      notify(error.message);
    }
  };
  return (
    <form onSubmit={channel ? handleChannel : handleServer}>
      <label className="colBlack" htmlFor="serverName">
        {channel ? "Channel's Name :" : "Server's Name : "}
      </label>
      <input
        className="authInp"
        name="serverName"
        type="text"
        id="serverName"
        value={serverName}
        placeholder={`${channel ? "Enter Channel Name" : "Enter Server Name"}`}
        required
        onChange={(e) => {
          setServerName(e.target.value);
        }}
      />
      <label className="colBlack" htmlFor="desc">
        Description :{" "}
      </label>
      <input
        className="authInp"
        name="desc"
        type="text"
        id="desc"
        value={desc}
        placeholder="Enter Description"
        required
        onChange={(e) => {
          setDesc(e.target.value);
        }}
      />
      <button className="authBtn">Create</button>
    </form>
  );
}
