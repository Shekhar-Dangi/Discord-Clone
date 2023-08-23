import IconNav from "../../components/IconNav/IconNav";
import styles from "../main.module.css";
import stylesNav from "./QuickNav.module.css";
import { useEffect, useState } from "react";

import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
export default function QuickNav() {
  const [data, setData] = useState([]);
  async function fetchData() {
    const servers = await axios.get("http://localhost:8000/api/guilds");

    setData(servers.data);
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
