import { Outlet, Link } from "react-router-dom";
import { Divider } from "antd";

const Root = () => {
  return (
    <div className="app">
      <nav className="menu-nav">
        <ul>
          <li>
            <Link to="/">首页</Link>
          </li>
          <li>
            <Link to="/chat">聊天室</Link>
          </li>
        </ul>
      </nav>
      <Divider />
      <Outlet />
    </div>
  );
};

export default Root;
