import React, { useState, useEffect, useCallback } from "react";
import IncomingCallNotification from "./IncomingCallNotification";
import VideoCallWindow from "@pages/callwindow/VideoCallWindow";
import { socketService } from "@services/socket/socket.service";
import { createRoot } from "react-dom/client";

const CallNotificationManager = () => {
    const [callData, setCallData] = useState(null);

    const handleCallIncoming = useCallback((data) => {
        setCallData(data);
    }, []);

    const handleCallEnded = useCallback(async () => {
        await new Promise((resolve) => {
          socketService.socket.off("call-incoming", handleCallIncoming);
          setCallData(null);
      
          setTimeout(() => {
            socketService.socket.on("call-incoming", handleCallIncoming);
            resolve(); // Đánh dấu rằng quá trình đã hoàn thành
          }, 1500);
        });
    }, []);

    useEffect(() => {
        const socket = socketService?.socket;
        
        // Đảm bảo có kết nối socket
        if (!socket) {
            console.warn("Socket connection not available");
            return;
        }
        
        // Đầu tiên, remove các listeners cũ (nếu có)
        socket.off("call-incoming", handleCallIncoming);
        socket.off("call-ended", handleCallEnded);
        
        // Sau đó đăng ký listeners mới
        socket.on("call-incoming", handleCallIncoming);
        socket.on("call-ended", handleCallEnded);
        
        // Cleanup khi component unmount
        return () => {
            if (socket) {
                socket.off("call-incoming", handleCallIncoming);
                socket.off("call-ended", handleCallEnded);
            }
        };
    }, [handleCallIncoming, handleCallEnded]);

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
                "about:blank",
                "_blank",
                "width=800,height=600,top=100,left=100,scrollbars=no"
            );

            if (!callWindow) {
                alert("Popup bị chặn. Vui lòng cho phép popup cho trang web này.");
                return;
            }

            callWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${callData.callType === "video" ? "Video" : "Voice"} Call</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { margin: 0; padding: 0; overflow: hidden; background-color: #000; }
                        #call-root { width: 100%; height: 100%; }
                    </style>
                </head>
                <body>
                    <div id="call-root"></div>
                </body>
                </html>
            `);
            callWindow.document.close();

            try {
                // Lấy stream của người dùng trong ngữ cảnh của cửa sổ mới
                const stream = await callWindow.navigator.mediaDevices.getUserMedia({
                    video: callData.callType === "video",
                    audio: true,
                });
                
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
                    socketService.socket.on("call-incoming", handleCallIncoming);
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

    const handleReject = async() => {
        if (callData) {
            // Gửi sự kiện reject-call đến người gọi
            await socketService.socket.emit("call-rejected", { 
                to: callData.callerName?.toLowerCase(),
                callId: callData.callId,
            });
            
            // Ẩn thông báo
            setCallData(null);
        }
        setTimeout(() => {
            socketService.socket.on("call-incoming", handleCallIncoming);
        }, 2000); // Đợi 2 giây trước khi đăng ký lại listener
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