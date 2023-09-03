import IconNav from "../../components/IconNav/IconNav";
import styles from "../main.module.css";
import stylesNav from "./QuickNav.module.css";
import { useEffect, useState } from "react";

import axiosInstance from "../../axios-config";
import { NavLink, useParams } from "react-router-dom";
import InputBox from "../../components/InputBox/InputBox";
import Modal from "../../components/Modal/Modal";
import { useSocket } from "../../SocketContext";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";
import ServerForm from "../../components/ServerForm/FormSerOrChan";
export default function QuickNav({}) {
  const socket = useSocket();
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [data, setData] = useState([]);
  const [modalVisiblity, setModalVisiblity] = useState(false);
  const [cookies, removeCookies] = useCookies();
  const [userM, setUserM] = useState(null);
  const createDisplayName = (name) => {
    const l1 = name.split(" ")[0][0];
    const l2 = name.split(" ")[0][1];
    return l1 + l2;
  };

  async function fetchData() {
    const user = await jwtDecode(cookies.token);
    setUserM(user);
    if (socket && "id" in user) {
      const servers = await axiosInstance.get(`/api/guilds/${user.id}`);
      setJoinedRoom(true);
      socket.emit("joinRoom", { id: user.id, private: true });
      setData(servers.data.servers);
    }
  }
  useEffect(() => {
    console.log("rendered");
    if ("token" in cookies && !joinedRoom) {
      fetchData();
      socket &&
        socket.on("addServer", async (server) => {
          console.log("New server");
          setData((prev) => [...prev, server]);
        });
    }
  }, [socket]);

  return (
    <>
      <div className={`${stylesNav.width} ${stylesNav.bgQuick}`}>
        <NavLink
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : "notActive"
          }
          to="/server/dm"
        >
          <IconNav dm={true} />
        </NavLink>
        <Modal
          heading="Create a new Server"
          component={ServerForm}
          modalVisibility={modalVisiblity}
          setModalVisibility={setModalVisiblity}
          user={userM}
        />
        <IconNav
          onClick={() => {
            setModalVisiblity(!modalVisiblity);
          }}
          dm={false}
          disName={<i className="fa-solid fa-plus"></i>}
        />

        {data.map((d) => (
          <NavLink
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : "notActive"
            }
            to={`server/${d._id}`}
          >
            <IconNav
              dm={false}
              id={d._id}
              disName={createDisplayName(d.name)}
            />
          </NavLink>
        ))}
      </div>
    </>
  );
}
