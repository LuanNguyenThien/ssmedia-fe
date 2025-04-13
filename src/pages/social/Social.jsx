import { useState, useEffect } from "react";
import "@pages/social/Social.scss";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "@components/sidebar/Sidebar";
import HeaderMb from "@components/header/HeaderMb";
import SidebarMb from "@components/sidebar/SidebarMb";
import Header from "@components/header/Header";
import StickySidebar from "@components/sidebar/StickySidebar";
import { includes } from "lodash";

const layout_1_4_list = ["streams", "profile", "save", "people","post"];
const layout_0_5_list = ["chat", "groups", "meeting"];

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

        // Default layout (1 - 3 - 1)
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
