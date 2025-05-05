import { useState, useEffect } from "react";
import "@pages/social/Social.scss";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Sidebar from "@components/sidebar/Sidebar";
import HeaderMb from "@components/header/HeaderMb";
import SidebarMb from "@components/sidebar/SidebarMb";
import Header from "@components/header/Header";
import StickySidebar from "@components/sidebar/StickySidebar";
import { includes } from "lodash";
import { socketService } from '@services/socket/socket.service';
import { useDispatch, useSelector } from "react-redux";
// import { logoutUser } from "@redux/reducers/auth/userSlice";

const layout_1_4_list = ["streams", "profile", "save", "people"];
const layout_0_5_list = ["chat", "groups", "meeting"];

const Social = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 390);
  const section = useLocation().pathname.split("/")[3];
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 390);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 

  const getLayout = () => {
    if (isMobile) {
      return <Outlet />;
    }

    if (includes(layout_1_4_list, section)) {
      return (
        <>
          <div className="col-span-3 lg:col-span-2">
            <Sidebar />
          </div>
          <div className="col-span-7 lg:col-span-8">
            <Outlet />
          </div>
        </>
      );
    }

    if (includes(layout_0_5_list, section)) {
      return (
        <div className="col-span-10 max-h-[88vh] min-h-[88vh] relative">
          <StickySidebar />
          <Outlet />
        </div>
      );
    }

    return (
      <>
        <div className="col-span-2">
          <Sidebar />
        </div>
        <div className="col-span-8 grid grid-cols-4">
          <Outlet />
        </div>
      </>
    );
  };

  return (
    <div className="!bg-secondary sm:px-12">
      {isMobile ? <HeaderMb /> : <Header />}
      <div className="grid grid-cols-10">{getLayout()}</div>
      {isMobile && <SidebarMb />}
    </div>
  );
};

export default Social;
