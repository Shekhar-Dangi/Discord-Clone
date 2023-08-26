import IconNav from "../../components/IconNav/IconNav";
import styles from "../main.module.css";
import stylesNav from "./QuickNav.module.css";
import { useEffect, useState } from "react";
import getUser from "../../user-local";

import axiosInstance from "../../axios-config";
import { NavLink, useParams } from "react-router-dom";
export default function QuickNav() {
  const user = getUser;
  console.log(user);
  const [data, setData] = useState([]);
  async function fetchData() {
    if ("_id" in user) {
      const servers = await axiosInstance.get(`/api/guilds/${user._id}`);
      setData(servers.data.servers);
    }
  }
  console.log("data", data);
  useEffect(() => {
    fetchData();
  }, []);

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
        {data.map((d) => (
          <NavLink
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : "notActive"
            }
            to={`server/${d._id}`}
          >
            <IconNav dm={false} id={d._id} disName={d.dName} />
          </NavLink>
        ))}
      </div>
    </>
  );
}
