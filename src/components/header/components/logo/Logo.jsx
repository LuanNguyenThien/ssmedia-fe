import { assets } from "@assets/assets";
import { useNavigate } from "react-router-dom";

const Logo = () => {
    const isMobile = window.innerWidth <= 390;
    const navigate = useNavigate();
    return (
        <div
            className={`w-fit h-10 cursor-pointer flex items-center justify-start gap-1 ${isMobile ? "max-w-10" : ""}`}
            onClick={() => {
                navigate("/app/social/streams");
            }}
        >
            <img src={assets.logo} alt="logo" className="size-full" />
            {!isMobile && <span className="h-full flex items-center text-xl font-extrabold text-[#1264AB]">RAINET</span>}
        </div>
    );
};

export default Logo;
