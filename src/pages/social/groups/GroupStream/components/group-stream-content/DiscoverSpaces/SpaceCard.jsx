import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const SpaceCard = ({
    space,
    onClick,
    onView,
    colorClass = "bg-[#074799]/60",
    className = "",
    size = 220,
    radius = 10,
}) => {
    const navigate = useNavigate();
    // const cardWidth = `w-[${size}px]`;
    const cardHeight = `h-[${Math.round(size * 1.46)}px]`;
    const circleSize = Math.round(size * 0.595);
    const innerCircle = Math.round(size * 0.536);
    const overlayTop = Math.round(size * 0.218);
    const borderRadius = `rounded-tr-[${radius}px]`;

    const handleView = (e) => {
        e.stopPropagation();
        navigate(`/app/social/group/${space.id}`);
    };

    return (
        <div className={`group col-span-1 size-full relative ${className}`}>
            <div
                className={`bg-white rounded-xl overflow-hidden flex flex-col justify-between items-center relative cursor-pointer transition-all duration-300 ease-out shadow-[0_14px_26px_rgba(0,0,0,0.04)] w-full ${cardHeight} ${borderRadius}
                    hover:transform hover:-translate-y-1 hover:scale-[1.005] hover:shadow-[0_24px_36px_rgba(0,0,0,0.11),0_24px_46px_rgba(206,178,252,0.48)]`}
            >
                <div className="flex-1 flex items-center justify-center w-full">
                    <div
                        className={`absolute rounded-full ${colorClass} top-[${overlayTop}px] left-[1/2] z-0 transition-transform duration-300 ease-out w-[${innerCircle}px] h-[${innerCircle}px] group-hover:scale-[5]`}
                    />
                    <div
                        className={`absolute border top-[${overlayTop}px] left-[1/2] bg-white border-2 flex justify-center items-center z-10 transition-all duration-300 ease-out overflow-hidden w-[${circleSize}px] h-[${circleSize}px] rounded-full border-white  group-hover:bg-primary/70`}
                    >
                        {/* Image or Fallback */}
                        {space.profileImage ? (
                            <img
                                src={space.profileImage}
                                alt={space.name}
                                className="w-full h-full object-cover rounded-full flex-shrink-0"
                            />
                        ) : (
                            <span className="w-full h-full flex justify-center items-center bg-gradient-to-br from-blue-500 to-primary/70 text-white text-5xl font-bold rounded-full">
                                {space.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>
                {/* Card Content */}
                <div className="flex flex-col max-w-[100%] items-center text-center z-40 px-5 pb-6">
                    <h3 className="text-[17px] font-bold text-gray-600 mb-2 transition-colors duration-300 ease-out leading-tight group-hover:text-white">
                        {space.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 transition-colors duration-300 ease-out group-hover:text-white">
                        {
                            space.members.filter(
                                (member) => member.status === "active"
                            ).length
                        }{" "}
                        members
                    </p>
                    <p className="text-[13px] max-w-[200px] text-gray-600 leading-relaxed transition-colors duration-300 ease-out line-clamp-3 group-hover:text-white">
                        {space.description}
                    </p>
                </div>
                {/* Pop-in Button */}
                <button
                    type="button"
                    onClick={handleView}
                    className="absolute w-max flex z-50 left-1/2 bottom-4 -translate-x-1/2 px-3 py-2 rounded-full bg-primary-white text-primary-black text-sm font-semibold shadow-lg opacity-0 scale-75 translate-y-6 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none group-hover:pointer-events-auto"
                >
                    Explore now
                </button>
            </div>
        </div>
    );
};

SpaceCard.propTypes = {
    space: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        profileImage: PropTypes.string,
        members: PropTypes.arrayOf(
            PropTypes.shape({
                status: PropTypes.string,
            })
        ).isRequired,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    onView: PropTypes.func,
    colorClass: PropTypes.string,
    className: PropTypes.string,
    size: PropTypes.number,
    radius: PropTypes.number,
};

export default SpaceCard;
