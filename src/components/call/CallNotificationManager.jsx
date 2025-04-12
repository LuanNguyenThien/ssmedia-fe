import React, { useState, useEffect } from "react";
import IncomingCallNotification from "./IncomingCallNotification";
import VideoCallWindow from "@/pages/callwindow/VideoCallWindow";
import { socketService } from "@services/socket/socket.service";
import { createRoot } from "react-dom/client";

const CallNotificationManager = () => {
    const [callData, setCallData] = useState(null);

    useEffect(() => {
        // Lắng nghe sự kiện 'call-incoming' từ Socket.IO
        socketService?.socket?.on("call-incoming", (data) => {
            setCallData(data);
        });

        // Cleanup listener khi component bị unmount
        return () => {
            socketService?.socket?.off("call-incoming");
        };
    }, []);

    const handleAccept = async () => {
        if (callData) {
            // Tạo phiên bản callData mới với isReceivingCall = true để VideoCallWindow biết đây là người nhận
            const updatedCallData = {
                ...callData,
                isReceivingCall: true,
                receiverId: callData.from, // Từ góc độ người nhận, người gọi trở thành receiver
                callerId: socketService.socket.id // ID của người nhận (người hiện tại)
            };
            
            // Mở cửa sổ cuộc gọi mới
            const callWindow = window.open(
                "",
                "_blank",
                "width=800,height=600,top=100,left=100,scrollbars=no"
            );
            
            // Thiết lập tiêu đề và style cho cửa sổ
            callWindow.document.title = `${callData.callType === "video" ? "Video" : "Voice"} Call`;
            callWindow.document.body.style.margin = '0';
            callWindow.document.body.style.overflow = 'hidden';
            callWindow.document.body.innerHTML = '<div id="call-root"></div>';
            
            try {
                // Lấy stream của người dùng trong ngữ cảnh của cửa sổ mới
                const stream = await callWindow.navigator.mediaDevices.getUserMedia({
                    video: callData.callType === "video",
                    audio: true,
                });
                
                // Thông báo cho người gọi biết cuộc gọi đã được chấp nhận
                // socketService.socket.emit("call-accepted", {
                //     to: callData.from,
                //     signal: updatedCallData.signal,
                //     callType: updatedCallData.callType
                // });
                
                // Render VideoCallWindow vào cửa sổ mới
                const root = createRoot(callWindow.document.getElementById("call-root"));
                root.render(
                    <VideoCallWindow
                        callData={updatedCallData}
                        stream={stream}
                        onClose={() => {
                            if (stream) {
                                stream.getTracks().forEach(track => track.stop());
                            }
                            callWindow.close();
                        }}
                        popupWindowRef={callWindow}
                    />
                );
                
                // Xử lý khi cửa sổ bị đóng
                callWindow.onbeforeunload = () => {
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                    }
                    socketService.socket.emit("end-call", { to: callData.from });
                };
                
                // Ẩn thông báo cuộc gọi đến
                setCallData(null);
            } catch (error) {
                console.error("Error accessing media devices:", error);
                callWindow.close();
                setCallData(null);
                
                // Thông báo với người gọi rằng đã xảy ra lỗi
                socketService.socket.emit("reject-call", { 
                    to: callData.from,
                    reason: "Failed to access media devices"
                });
            }
        }
    };

    const handleReject = () => {
        if (callData) {
            // Gửi sự kiện reject-call đến người gọi
            socketService.socket.emit("reject-call", { 
                to: callData.from,
                reason: "Call rejected by user"
            });
            
            // Ẩn thông báo
            setCallData(null);
        }
    };

    return (
        <>
            {callData && (
                <IncomingCallNotification
                    callData={callData}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />
            )}
        </>
    );
};

export default CallNotificationManager;