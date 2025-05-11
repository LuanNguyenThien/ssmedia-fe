import { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import Avatar from "@components/avatar/Avatar";
import Button from "@components/button/Button";
import { useDispatch } from "react-redux";
import { Utils } from "@services/utils/utils.service";
import Spinner from "@components/spinner/Spinner";
import ProcessSpinner from "@/components/state/ProcessSpinner";
import "./CreateGroup.scss"; // Reusing the same styles for consistency
import { groupChatService } from "@/services/api/chat/group-chat.service";
import GroupChatUtils from "@/services/utils/group-chat-utils.service";
import { timeAgo } from "@/services/utils/timeago.utils";
import { useNavigate } from "react-router-dom";

const InvitationsList = ({ onClickBack }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [invitations, setInvitations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchInvitations = async () => {
        try {
            const response = await groupChatService.getUserPendingInvitations();
            setInvitations(response.data.pendingGroups);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching invitations:", error);
            Utils.dispatchNotification(
                error.response?.data?.message || "Error fetching invitations",
                "error",
                dispatch
            );
            setIsLoading(false);
        }
    };

    const handleAcceptInvitation = async (invitation) => {
        setIsProcessing(true);
        try {
            await GroupChatUtils.handleGroupInvitation(invitation._id, true);
            GroupChatUtils.emitGroupAction("ACCEPT_GROUP_INVITATION", {
                groupId: invitation._id,
            });
            GroupChatUtils.navigateToGroupChat(invitation, navigate);
        } catch (error) {
            console.error("Error accepting invitation:", error);
            Utils.dispatchNotification(
                error.response?.data?.message || "Error accepting invitation",
                "error",
                dispatch
            );
        } finally {
            fetchInvitations();
            setIsProcessing(false);
        }
    };

    const handleDeclineInvitation = async (invitationId) => {
        setIsProcessing(true);
        try {
            await GroupChatUtils.handleGroupInvitation(invitationId, false);

            GroupChatUtils.emitGroupAction("ACCEPT_GROUP_INVITATION", {
                groupId: invitationId,
            });
        } catch (error) {
            console.error("Error declining invitation:", error);
            Utils.dispatchNotification(
                error.response?.data?.message || "Error declining invitation",
                "error",
                dispatch
            );
            setIsProcessing(false);
        } finally {
            fetchInvitations();
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        fetchInvitations();
    }, []);

    return (
        <>
            {isProcessing && (
                <div
                    className="absolute top-0 left-0 right-0 bottom-0 w-full h-full flex justify-center items-center z-[1000] backdrop-blur-sm"
                    style={{ minHeight: "100%", position: "absolute" }}
                >
                    <ProcessSpinner />
                </div>
            )}
            <div className="waiting-list overflow-y-scroll h-full max-h-full relative">
                <div className="waiting-list-header flex items-center justify-between py-2 ">
                    <div
                        className="flex items-center cursor-pointer text-[#1264AB] transition-colors duration-200 mr-5 hover:text-[#0a4d85]"
                        onClick={onClickBack}
                    >
                        <IoIosArrowBack className="text-[20px] mr-[5px]" />
                        <span className="font-medium">Back</span>
                    </div>
                    <span className="text-xl font-bold">Group Invitations</span>
                </div>

                <div className="waiting-list-content">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-60">
                            <Spinner />
                        </div>
                    ) : invitations.length > 0 ? (
                        <div className="invitation-list cursor-pointer overflow-y-scroll h-max">
                            {invitations.map((invitation) => (
                                <div
                                    key={invitation._id}
                                    className="invitation-card bg-background-blur hover:bg-primary/10 rounded-lg p-3 my-3 shadow-sm"
                                >
                                    <div className="flex items-center mb-4 gap-4 sm:gap-2">
                                        <div  className="flex-shrink-0 self-center">
                                            <Avatar
                                                name={invitation.name}
                                                bgColor={invitation.avatarColor}
                                                textColor="#ffffff"
                                                size={50}
                                                avatarSrc={
                                                    invitation.profilePicture
                                                }
                                            />
                                        </div>
                                    
                                        <div className="flex-grow-0 flex flex-col justify-start items-start truncate">
                                            <span className="font-bold text-lg max-w-full truncate">
                                                {invitation.name}
                                            </span>
                                            <p className="text-xs text-gray-600">
                                                Invited by:{" "}
                                                {invitation.members[0].username}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {timeAgo.dayMonthYear(
                                                    invitation.createdAt
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            label="Decline"
                                            handleClick={() =>
                                                handleDeclineInvitation(
                                                    invitation._id
                                                )
                                            }
                                            className="decline-button py-1 px-3 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
                                        />
                                        <Button
                                            label="Accept"
                                            handleClick={() =>
                                                handleAcceptInvitation(
                                                    invitation
                                                )
                                            }
                                            className="accept-button py-1 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state text-center py-10">
                            <p className="text-xl text-gray-500">
                                No pending invitations
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                                You'll see group invitations here when someone
                                adds you to a group
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default InvitationsList;
