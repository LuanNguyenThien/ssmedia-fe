import React, { useEffect, useRef } from "react";
import "./IncomingCallNotification.scss";
import logo from "@assets/logo.png";
import ringtoneSound from "@assets/sounds/ringtone.mp3";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Utils } from "@services/utils/utils.service";
import { socketService } from "@services/socket/socket.service";

const IncomingCallNotification = ({ callData, onAccept, onReject }) => {
    const audioRef = useRef(null);
    const notificationPromptDismissed = useLocalStorage("notificationPromptDismissed", "get");

    // Xử lý âm thanh
    useEffect(() => {
        // Start playing the ringtone when the component mounts
        if (audioRef.current) {
            audioRef.current.volume = 1.0; 
            audioRef.current.loop = true;
            if(!notificationPromptDismissed) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Autoplay prevented:", error);
                    });
                }
                if(!Utils.isMobileDevice()) {
                    showNotification();
                }
            } else {
                audioRef.current.pause(); // Dừng âm thanh nếu đã từ chối thông báo
            }
        }
        
        // Clean up
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);
    
    // Hiển thị thông báo
    const showNotification = () => {
        const notification = new Notification("Cuộc gọi đến", {
            body: `${callData.callerName || "Unknown"} đang gọi cho bạn`,
            icon: logo, // Thay đổi đường dẫn tới logo của bạn
            requireInteraction: true, // Thông báo không tự đóng
            silent: false // Cho phép âm thanh nếu trình duyệt hỗ trợ
        });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    };
    
    // Xử lý nút chấp nhận/từ chối
    const handleAccept = () => {
        socketService.socket.off("call-incoming");
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        onAccept();
    };

    const handleReject = () => {
        socketService.socket.off("call-incoming");
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        onReject();
    };

    return (
        <div className="incoming-call-notification">
            <audio ref={audioRef} src={ringtoneSound} />
            <div className="notification-content">
                <h3>{callData.callerName || "Unknown Caller"} is calling...</h3>
                <p>{callData.callType === "video" ? "Video Call" : "Voice Call"}</p>
                <div className="notification-actions">
                    <button className="accept-button" onClick={handleAccept}>
                        Accept
                    </button>
                    <button className="reject-button" onClick={handleReject}>
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncomingCallNotification;