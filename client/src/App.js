import { Outlet } from "react-router-dom";
import "./App.css";
import ChatBox from "./pages/ChatBox/ChatBox";
import ChatsNav from "./pages/ChatsNav/ChatsNav";
import QuickNav from "./pages/QuickNav/QuickNav";
import styles from "./pages/main.module.css";

function App() {
  const containerClasses = `${styles.flexDirectionRow} ${styles.makeFlex} ${styles.h100vh} mainContainer`;
  return (
    <div className={containerClasses}>
      <QuickNav />
      <Outlet />
    </div>
  );
}

export default App;
