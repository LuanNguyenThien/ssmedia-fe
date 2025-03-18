import { useState, useEffect } from "react";
import "@pages/social/Social.scss";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "@components/sidebar/Sidebar";
import HeaderMb from "components/header/HeaderMb";
import SidebarMb from "components/sidebar/SidebarMb";
import Header from "components/header/Header";
import StickySidebar from "components/sidebar/StickySidebar";
import { includes } from "lodash";

const layout_1_4_list = ["profile", "save"];
const layout_0_5_list = ["chat", "group", "meeting"];

const Social = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 390);
    const section = useLocation().pathname.split("/")[3];

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
                    <div className="col-span-1">
                        <Sidebar />
                    </div>
                    <div className="col-span-4">
                        <Outlet />
                    </div>
                </>
            );
        }

        if (includes(layout_0_5_list, section)) {
            return (
                <div className="col-span-5 max-h-[86vh] relative">
                    <StickySidebar />
                    <Outlet />
                </div>
            );
        }

        // Default layout (1 - 3 - 1)
        return (
            <>
                <div className="col-span-1">
                    <Sidebar />
                </div>
                <div className="col-span-4 grid grid-cols-4">
                    <Outlet />
                </div>
            </>
        );
    };

    return (
        <div className="!bg-secondary sm:px-12">
            {isMobile ? <HeaderMb /> : <Header />}
            <div className="grid grid-cols-5">{getLayout()}</div>
            {isMobile && <SidebarMb />}
        </div>
    );
};

export default Social;
