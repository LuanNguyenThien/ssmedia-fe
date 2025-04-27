import Avatar from "@/components/avatar/Avatar";
import { useRef, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { DynamicSVG } from "./../../../sidebar/components/SidebarItems";
import { icons } from "@/assets/assets";
import useHandleOutsideClick from "@/hooks/useHandleOutsideClick";

const MemberCard = ({
    member,
    renderState,
    isAdmin,
    handlePromoteMember,
    handleRemoveMember,
}) => {
    const [isShowSelections, setIsShowSelections] = useState(false);
    const selectionsRef = useRef(null);
    useHandleOutsideClick(selectionsRef, setIsShowSelections);

    return (
        <div key={member.userId} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar
                    avatarSrc={member.profilePicture}
                    name={member.username}
                    bgColor={member.avatarColor}
                    textColor="#ffffff"
                    size={40}
                />
                <span className="text-sm font-semibold">{member.username}</span>
            </div>
            <div className="w-max gap-2 flex items-center justify-between">
                {member?.role === "admin"
                    ? renderState("admin")
                    : member.state === "accepted"
                    ? renderState("member")
                    : renderState("invited")}

                {isAdmin && member?.role !== "admin" && (
                    <div
                        onClick={() => setIsShowSelections(!isShowSelections)}
                        className="text-primary-black cursor-pointer relative "
                    >
                        <FaEllipsisV />
                        {/* pop up */}
                        {isShowSelections && (
                            <div
                                ref={selectionsRef}
                                className="absolute border rounded-md bg-primary-white shadow-lg py-2 px-4 size-max right-0 flex flex-col gap-2 justify-start items-start z-50"
                            >
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveMember(member);
                                    }}
                                    className=" hover:text-red-400 flex items-center gap-2 text-sm font-semibold "
                                >
                                    <DynamicSVG
                                        svgData={icons.removeMember}
                                        className={"size-6"}
                                    />
                                    Remove
                                </span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePromoteMember(member);
                                    }}
                                    className=" hover:text-primary/50 flex items-center gap-2 text-sm font-semibold "
                                >
                                    <DynamicSVG
                                        svgData={icons.arrowUpCircle}
                                        className={"size-6"}
                                    />
                                    Promote to admin
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberCard;
