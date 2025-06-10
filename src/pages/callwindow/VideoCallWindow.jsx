import { useEffect, useRef, useState } from "react"
import Peer from "simple-peer"
import { socketService } from "@services/socket/socket.service"
import waitingRingtone from "@assets/sounds/waiting-ring.mp3"
import { Utils } from "@services/utils/utils.service"
const VideoCallWindow = ({ callData, stream, onClose, popupWindowRef }) => {
  const closingDueToRemoteEnd = useRef(false)
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 6 // Tăng số lần thử để phủ hết 45 giây
  const callAcceptedRef = useRef(false)
  const callEndedRef = useRef(false)
  const signalDataRef = useRef(null)
  const retryTimeoutsRef = useRef([])
  const [callTimeout, setCallTimeout] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(45)
  const [callAccepted, setCallAccepted] = useState(false)
  const [callEnded, setCallEnded] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLocalVideoHidden, setIsLocalVideoHidden] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)
  const [windowHeight, setWindowHeight] = useState(typeof window !== "undefined" ? window.innerHeight : 0)
  const [visualViewportHeight, setVisualViewportHeight] = useState(
    typeof window !== "undefined" && window.visualViewport ? window.visualViewport.height : 0,
  )

  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [screenStream, setScreenStream] = useState(null)
  const originalStreamRef = useRef(null)
  const waitingRingtoneRef = useRef(null)

  const myVideo = useRef()
  const userVideo = useRef()
  const connectionRef = useRef()
  const containerRef = useRef()
  const isConnectedRef = useRef(false)

  // Sử dụng tham chiếu cửa sổ popup được truyền vào
  const popupWindow = popupWindowRef || window
  const popupDocument = popupWindow.document

  // Responsive style adjustments based on screen size
  const isMobile = windowWidth <= 480
  const isTablet = windowWidth <= 768 && windowWidth > 480
  const isLandscape = windowWidth > windowHeight

  // Function to check if we're in fullscreen mode using the popup document
  const checkFullscreen = () => {
    if (!popupDocument) return false

    return !!(
      popupDocument.fullscreenElement ||
      popupDocument.mozFullScreenElement ||
      popupDocument.webkitFullscreenElement ||
      popupDocument.msFullscreenElement
    )
  }

  // Function to enter fullscreen using the popup document
  const enterFullscreen = async () => {
    try {
      if (!containerRef.current) {
        console.error("[POPUP] Container ref is not available")
        return
      }

      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen()
      } else if (containerRef.current.mozRequestFullScreen) {
        await containerRef.current.mozRequestFullScreen()
      } else if (containerRef.current.webkitRequestFullscreen) {
        await containerRef.current.webkitRequestFullscreen()
      } else if (containerRef.current.msRequestFullscreen) {
        await containerRef.current.msRequestFullscreen()
      }
      setIsFullscreen(true)
    } catch (err) {
      console.error("[POPUP] Error entering fullscreen:", err)

      // Alternative approach for popup windows
      try {
        const elem = containerRef.current
        if (elem) {
          elem.style.position = "fixed"
          elem.style.top = "0"
          elem.style.left = "0"
          elem.style.width = "100%"
          elem.style.height = "100%"
          elem.style.zIndex = "9999"
          setIsFullscreen(true)
        }
      } catch (altErr) {
        console.error("[POPUP] Alternative fullscreen approach failed:", altErr)
      }
    }
  }

  // Function to exit fullscreen using the popup document
  const exitFullscreen = async () => {
    try {
      // Check if we're in browser fullscreen mode using the popup document
      if (
        popupDocument.fullscreenElement ||
        popupDocument.webkitFullscreenElement ||
        popupDocument.mozFullScreenElement ||
        popupDocument.msFullscreenElement
      ) {
        // Try the standard method first using the popup document
        if (popupDocument.exitFullscreen) {
          await popupDocument.exitFullscreen()
        } else if (popupDocument.webkitExitFullscreen) {
          await popupDocument.webkitExitFullscreen()
        } else if (popupDocument.mozCancelFullScreen) {
          await popupDocument.mozCancelFullScreen()
        } else if (popupDocument.msExitFullscreen) {
          await popupDocument.msExitFullscreen()
        }
      } else {
        // If we're using the alternative approach
        if (containerRef.current) {
          containerRef.current.style.position = ""
          containerRef.current.style.top = ""
          containerRef.current.style.left = ""
          containerRef.current.style.width = ""
          containerRef.current.style.height = ""
          containerRef.current.style.zIndex = ""
        }
      }

      // Always update the state
      setIsFullscreen(false)
    } catch (err) {
      console.error("Error exiting fullscreen:", err)

      // Force update the state anyway
      setIsFullscreen(false)

      // Try the alternative approach if needed
      if (containerRef.current) {
        containerRef.current.style.position = ""
        containerRef.current.style.top = ""
        containerRef.current.style.left = ""
        containerRef.current.style.width = ""
        containerRef.current.style.height = ""
        containerRef.current.style.zIndex = ""
      }
    }
  }

  const toggleLocalVideo = () => {
    setIsLocalVideoHidden(!isLocalVideoHidden);
  };

  // Function to toggle screen sharing
  // const toggleScreenShare = async () => {
  //   try {
  //     if (!isScreenSharing) {
  //       // Lưu stream camera ban đầu để có thể khôi phục sau
  //       originalStreamRef.current = stream;

  //       // Yêu cầu quyền chia sẻ màn hình
  //       const displayStream = await popupWindow.navigator.mediaDevices.getDisplayMedia({
  //         video: true,
  //         audio: true // Đa số trình duyệt chưa hỗ trợ audio khi share screen
  //       });

  //       // Lưu screen stream để dọn dẹp sau này
  //       setScreenStream(displayStream);

  //       // Thay thế video track trong kết nối peer
  //       if (connectionRef.current && connectionRef.current.connected) {
  //         // Lấy video track từ màn hình
  //         const screenTrack = displayStream.getVideoTracks()[0];

  //         // Lấy sender video hiện tại từ peer connection
  //         const senders = connectionRef.current._pc.getSenders();
  //         const videoSender = senders.find(sender =>
  //           sender.track && sender.track.kind === 'video'
  //         );

  //         // Thay thế video track
  //         if (videoSender) {
  //           videoSender.replaceTrack(screenTrack);
  //         }

  //         // Cập nhật video local để hiển thị màn hình đang chia sẻ
  //         if (myVideo.current) {
  //           myVideo.current.srcObject = displayStream;
  //         }
  //       }

  //       // Xử lý khi người dùng dừng chia sẻ màn hình qua trình duyệt
  //       displayStream.getVideoTracks()[0].onended = () => {
  //         stopScreenSharing();
  //       };

  //       setIsScreenSharing(true);
  //     } else {
  //       stopScreenSharing();
  //     }
  //   } catch (err) {
  //     console.error("Error sharing screen:", err);
  //   }
  // };
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Lưu stream camera ban đầu để có thể khôi phục sau
        originalStreamRef.current = stream

        // Yêu cầu quyền chia sẻ màn hình với audio
        const displayStream = await popupWindow.navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true, // Yêu cầu audio từ chia sẻ màn hình
        })

        // Tạo audio context để mix audio
        const audioContext = new AudioContext()

        // Tạo destination cho audio đã mix
        const destination = audioContext.createMediaStreamDestination()

        // Thêm audio từ microphone (stream ban đầu)
        if (stream.getAudioTracks().length > 0) {
          const micSource = audioContext.createMediaStreamSource(stream)
          micSource.connect(destination)
        }

        // Thêm audio từ screen sharing nếu có
        if (displayStream.getAudioTracks().length > 0) {
          const screenSource = audioContext.createMediaStreamSource(displayStream)
          screenSource.connect(destination)
        }

        // Tạo stream kết hợp:
        // - Video từ screen sharing
        // - Audio đã kết hợp
        const combinedStream = new MediaStream()

        // Thêm video track từ screen share
        displayStream.getVideoTracks().forEach((track) => {
          combinedStream.addTrack(track)
        })

        // Thêm combined audio track
        destination.stream.getAudioTracks().forEach((track) => {
          combinedStream.addTrack(track)
        })

        // Lưu screen stream để dọn dẹp sau này
        setScreenStream(displayStream)

        // Thay thế video track trong kết nối peer
        if (connectionRef.current && connectionRef.current._pc) {
          const senders = connectionRef.current._pc.getSenders()

          // Thay video track
          const videoSender = senders.find((sender) => sender.track && sender.track.kind === "video")
          if (videoSender) {
            videoSender.replaceTrack(combinedStream.getVideoTracks()[0])
          }

          // Thay audio track bằng bản đã mix
          const audioSender = senders.find((sender) => sender.track && sender.track.kind === "audio")
          if (audioSender && combinedStream.getAudioTracks().length > 0) {
            audioSender.replaceTrack(combinedStream.getAudioTracks()[0])
          }

          // Cập nhật video local để hiển thị màn hình đang chia sẻ
          if (myVideo.current) {
            myVideo.current.srcObject = combinedStream
          }
        }

        // Xử lý khi người dùng dừng chia sẻ màn hình qua trình duyệt
        displayStream.getVideoTracks()[0].onended = () => {
          stopScreenSharing()
        }

        setIsScreenSharing(true)
      } else {
        stopScreenSharing()
      }
    } catch (err) {
      console.error("Error sharing screen:", err)
    }
  }

  // const stopScreenSharing = () => {
  //   try {
  //     if (screenStream) {
  //       // Dừng tất cả tracks trong screen stream
  //       screenStream.getTracks().forEach(track => track.stop());

  //       // Khôi phục video track ban đầu trong kết nối peer
  //       if (connectionRef.current && connectionRef.current.connected && originalStreamRef.current) {
  //         const senders = connectionRef.current._pc.getSenders();
  //         const videoSender = senders.find(sender =>
  //           sender.track && sender.track.kind === 'video'
  //         );

  //         if (videoSender && originalStreamRef.current.getVideoTracks().length > 0) {
  //           videoSender.replaceTrack(originalStreamRef.current.getVideoTracks()[0]);
  //         }

  //         // Khôi phục video local để hiển thị camera
  //         if (myVideo.current) {
  //           myVideo.current.srcObject = originalStreamRef.current;
  //         }
  //       }
  //     }

  //     setScreenStream(null);
  //     setIsScreenSharing(false);
  //   } catch (err) {
  //     console.error("Error stopping screen share:", err);
  //   }
  // };

  const stopScreenSharing = () => {
    try {
      if (screenStream) {
        // Dừng tất cả tracks trong screen stream
        screenStream.getTracks().forEach((track) => track.stop())

        // Khôi phục video và audio track ban đầu trong kết nối peer
        if (connectionRef.current && connectionRef.current.connected && originalStreamRef.current) {
          const senders = connectionRef.current._pc.getSenders()

          // Khôi phục video track
          const videoSender = senders.find((sender) => sender.track && sender.track.kind === "video")
          if (videoSender && originalStreamRef.current.getVideoTracks().length > 0) {
            videoSender.replaceTrack(originalStreamRef.current.getVideoTracks()[0])
          }

          // Khôi phục audio track
          const audioSender = senders.find((sender) => sender.track && sender.track.kind === "audio")
          if (audioSender && originalStreamRef.current.getAudioTracks().length > 0) {
            audioSender.replaceTrack(originalStreamRef.current.getAudioTracks()[0])
          }

          // Khôi phục video local để hiển thị camera
          if (myVideo.current) {
            myVideo.current.srcObject = originalStreamRef.current
          }
        }
      }

      setScreenStream(null)
      setIsScreenSharing(false)
    } catch (err) {
      console.error("Error stopping screen share:", err)
    }
  }

  // Toggle fullscreen with improved popup window handling
  const toggleFullscreen = async () => {
    // Use a direct check of the DOM element styles as a fallback
    const isUsingAlternativeFullscreen =
      containerRef.current &&
      containerRef.current.style.position === "fixed" &&
      containerRef.current.style.width === "100%" &&
      containerRef.current.style.height === "100%"

    // Check the actual browser fullscreen state in THIS window
    const actuallyInFullscreen = checkFullscreen() || isUsingAlternativeFullscreen

    // If our state doesn't match the actual state, sync them
    if (isFullscreen !== actuallyInFullscreen) {
      setIsFullscreen(actuallyInFullscreen)
      return // Return early to prevent toggle on sync
    }

    // Now toggle based on the synced state
    if (isFullscreen) {
      await exitFullscreen()
    } else {
      await enterFullscreen()
    }
  }

  const sendCallSignal = (signalData) => {
    socketService.socket.emit("call-user", {
      receiverId: callData.receiverId,
      receiverAvatarColor: callData?.receiverAvatarColor,
      receiverAvatarSrc: callData?.receiverAvatarSrc,
      userToCall: callData.receiverName,
      callerId: callData.callerId,
      callerName: callData.callerName,
      callerAvatarColor: callData?.callerAvatarColor,
      callerAvatarSrc: callData?.callerAvatarSrc,
      callType: callData.callType,
      signal: signalData,
      callId: callData.callId,
      conversationId: callData.conversationId,
    })

    console.log(`Đang gọi cho ${callData.receiverName}... (lần ${retryCount + 1})`)
  }

  const scheduleRetries = (signalData) => {
    // Xóa các timeout cũ nếu có
    retryTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
    retryTimeoutsRef.current = []

    // Tính toán thời gian giữa các lần thử
    // Ví dụ với MAX_RETRIES = 5, sẽ có các lần thử tại giây thứ: 5, 10, 15, 20, 25
    const interval = Math.floor(36000 / MAX_RETRIES) // 36000ms = 36 giây (để kết thúc trước timeout 45s)

    for (let i = 0; i < MAX_RETRIES; i++) {
      const timeoutId = setTimeout(
        () => {
          if (!callAccepted.current || !callEnded.current) {
            setRetryCount(i + 1)
            sendCallSignal(signalData);
            console.log(`Đang thử lại lần ${i + 1}/${MAX_RETRIES} (${(i + 1) * (interval / 1000)} giây)`)
          } else {
            // Nếu cuộc gọi đã được chấp nhận hoặc đã kết thúc, xóa các timeout còn lại
            retryTimeoutsRef.current.forEach((id) => clearTimeout(id))
          }
        },
        interval * (i + 1),
      )

      retryTimeoutsRef.current.push(timeoutId)
    }
  }

  useEffect(() => {
    callAcceptedRef.current = callAccepted
    callEndedRef.current = callEnded

    // Hủy tất cả timeout khi cuộc gọi được chấp nhận
    if ((callAccepted && retryTimeoutsRef.current.length > 0) || (callEnded && retryTimeoutsRef.current.length > 0)) {
      console.log("Call accepted or ended, clearing all retry timeouts")
      retryTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
      retryTimeoutsRef.current = []
    }
  }, [callAccepted, callEnded])

  // Thiết lập timeout khi component mount nếu là người gọi
  useEffect(() => {
    // Chỉ thiết lập timeout nếu là người gọi, không phải người nhận
    if (!callData.isReceivingCall) {
      const timeout = setTimeout(() => {
        if (!callAccepted.current && !callEnded.current) {
          console.log("Call not answered after 45 seconds, closing window...")
          retryTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
          endCall()
        }
      }, 45000) // 45 giây

      setCallTimeout(timeout)

      // Cleanup function
      return () => {
        if (timeout) {
          clearTimeout(timeout)
        }
        retryTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
      }
    }
  }, [])

  // Hủy timeout khi cuộc gọi được chấp nhận
  useEffect(() => {
    if ((callAccepted && callTimeout) || (callEnded && callTimeout)) {
      clearTimeout(callTimeout)
      setCallTimeout(null)
    }
  }, [callAccepted, callTimeout, callEnded])

  useEffect(() => {
    if (!callData.isReceivingCall && !callAccepted) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000) // 1 giây

      return () => clearInterval(interval)
    }
  }, [callAccepted, callData.isReceivingCall])

  // Thêm useEffect để quản lý ringtone
  useEffect(() => {
    // Phát nhạc chờ nếu chưa kết nối và chưa kết thúc cuộc gọi
    if (!callAccepted && !callEnded) {
      if (waitingRingtoneRef.current) {
        waitingRingtoneRef.current.volume = 0.5 // Điều chỉnh âm lượng phù hợp
        waitingRingtoneRef.current.loop = true

        const playPromise = waitingRingtoneRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Không thể phát âm thanh chờ:", error)
          })
        }
      }
    } else {
      // Dừng âm thanh nếu cuộc gọi đã được kết nối hoặc kết thúc
      if (waitingRingtoneRef.current) {
        waitingRingtoneRef.current.pause()
        waitingRingtoneRef.current.currentTime = 0
      }
    }

    // Dọn dẹp khi component unmount
    return () => {
      if (waitingRingtoneRef.current) {
        waitingRingtoneRef.current.pause()
        waitingRingtoneRef.current.currentTime = 0
      }
    }
  }, [callAccepted, callEnded])

  // Listen for fullscreen changes from browser (e.g., Esc key)
  useEffect(() => {
    if (!popupDocument) return

    const handleFullscreenChange = () => {
      const fullscreenActive = checkFullscreen()
      setIsFullscreen(fullscreenActive)
    }

    popupDocument.addEventListener("fullscreenchange", handleFullscreenChange)
    popupDocument.addEventListener("mozfullscreenchange", handleFullscreenChange)
    popupDocument.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    popupDocument.addEventListener("MSFullscreenChange", handleFullscreenChange)

    return () => {
      if (popupDocument) {
        popupDocument.removeEventListener("fullscreenchange", handleFullscreenChange)
        popupDocument.removeEventListener("mozfullscreenchange", handleFullscreenChange)
        popupDocument.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
        popupDocument.removeEventListener("MSFullscreenChange", handleFullscreenChange)
      }
    }
  }, [popupDocument])

  useEffect(() => {
    // Add viewport meta tag for proper mobile scaling
    if (popupDocument) {
      const viewportMeta = popupDocument.createElement("meta")
      viewportMeta.name = "viewport"
      viewportMeta.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      popupDocument.head.appendChild(viewportMeta)

      // Only apply fixed body styling on mobile devices
      const styleElement = popupDocument.createElement("style")
      if (Utils.isMobileDevice()) {
        styleElement.textContent = `
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          position: fixed;
          width: 100%;
          top: 0;
          left: 0;
        }
      `
      } else {
        styleElement.textContent = `
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `
      }
      popupDocument.head.appendChild(styleElement)

      // Cleanup function
      return () => {
        if (popupDocument.head.contains(viewportMeta)) {
          popupDocument.head.removeChild(viewportMeta)
        }

        if (popupDocument.head.contains(styleElement)) {
          popupDocument.head.removeChild(styleElement)
        }
      }
    }
  }, [])

  useEffect(() => {
    socketService.socket.off("call-busy")
    socketService.socket.off("call-accepted")
    socketService.socket.off("call-ended", remoteCallEnd)
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream
    }

    if (callData.isReceivingCall) {
      isConnectedRef.current = true
      setCallAccepted(true)
      answerCall()
    } else {
      callUser()
    }

    socketService.socket.on("call-busy", (data) => {

      // Create a modal div for the busy notification
      const busyModal = document.createElement("div")
      busyModal.id = "busy-notification-modal"
      busyModal.style.position = "fixed"
      busyModal.style.top = "0"
      busyModal.style.left = "0"
      busyModal.style.width = "100%"
      busyModal.style.height = "100%"
      busyModal.style.backgroundColor = "rgba(0, 0, 0, 0.7)"
      busyModal.style.zIndex = "1000"
      busyModal.style.display = "flex"
      busyModal.style.alignItems = "center"
      busyModal.style.justifyContent = "center"

      // Create the notification content
      const notificationContent = document.createElement("div")
      notificationContent.style.backgroundColor = "#1e293b"
      notificationContent.style.color = "white"
      notificationContent.style.padding = "20px"
      notificationContent.style.borderRadius = "10px"
      notificationContent.style.maxWidth = "300px"
      notificationContent.style.textAlign = "center"
      notificationContent.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.5)"

      // Add notification content
      notificationContent.innerHTML = `
        <div style="font-size: 18px; margin-bottom: 10px; font-weight: bold;">User is busy</div>
        <div style="font-size: 14px; margin-bottom: 20px;">${callData.receiverName || "The recipient"} is currently on another call</div>
        <button id="close-busy-notification" style="background-color: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: bold;">Close</button>
      `

      busyModal.appendChild(notificationContent)
      document.body.appendChild(busyModal)

      
      // Add event listener to close button
      document.getElementById("close-busy-notification").addEventListener("click", () => {
        document.body.removeChild(busyModal)
        // endCall()
      })
      endCall()

      // Auto close after 5 seconds
      setTimeout(() => {
        if (document.body.contains(busyModal)) {
          document.body.removeChild(busyModal)
        }
      }, 5000)
    })

    socketService.socket.on("call-accepted", (data) => {
      isConnectedRef.current = true
      setCallAccepted(true)
      connectionRef.current.signal(data.signal)
    })

    socketService.socket.on("call-ended", remoteCallEnd)

    // Function to update dimensions
    const updateDimensions = () => {
      if (popupWindow) {
        setWindowWidth(popupWindow.innerWidth)
        setWindowHeight(popupWindow.innerHeight)

        // Use visualViewport if available (more accurate on mobile)
        if (popupWindow.visualViewport) {
          setVisualViewportHeight(popupWindow.visualViewport.height)
        }

        // Update container height to match visual viewport on mobile
        if (containerRef.current) {
          if (Utils.isMobileDevice() && popupWindow.visualViewport) {
            containerRef.current.style.height = `${popupWindow.visualViewport.height}px`
          } else {
            containerRef.current.style.height = "100%"
          }
        }
      }
    }

    // Add resize and visualViewport resize event listeners to the popup window
    if (popupWindow) {
      popupWindow.addEventListener("resize", updateDimensions)

      if (popupWindow.visualViewport) {
        popupWindow.visualViewport.addEventListener("resize", updateDimensions)
        popupWindow.visualViewport.addEventListener("scroll", updateDimensions)
      }
    }

    // Initial call to handle dimensions
    updateDimensions()

    return () => {
      socketService.socket.off("call-busy")
      socketService.socket.off("call-accepted")
      socketService.socket.off("call-ended", remoteCallEnd)

      if (popupWindow) {
        popupWindow.removeEventListener("resize", updateDimensions)

        if (popupWindow.visualViewport) {
          popupWindow.visualViewport.removeEventListener("resize", updateDimensions)
          popupWindow.visualViewport.removeEventListener("scroll", updateDimensions)
        }
      }

      if (connectionRef.current) {
        connectionRef.current.destroy()
      }
    }
  }, [stream, callData, popupWindow])

  useEffect(() => {
    // Xử lý khi cửa sổ sắp bị đóng
    const handleBeforeUnload = (e) => {
      // Gọi endCall trước khi trang đóng
      setCallEnded(true)
      if (!callEnded && !closingDueToRemoteEnd.current) {
        if (connectionRef.current) {
          try {
            connectionRef.current.destroy()
          } catch (err) {
            console.error("Lỗi khi hủy kết nối:", err)
          }
        }

        // Kiểm tra xem có phải trạng thái busy không
        // Nếu không phải busy thì mới gửi socket event để báo cho phía bên kia
        const isBusyState = document.getElementById("close-busy-notification") !== null

        if (!isBusyState && (signalDataRef.current || callData.isReceivingCall)) {
          // Gửi socket event để báo cho phía bên kia
          if (callData.isReceivingCall) {
            socketService.socket.emit("call-ended", {
              to: callData.callerName?.toLowerCase(),
              callId: callData.callId,
            })
          } else {
            socketService.socket.emit("call-ended", {
              to: callData.receiverName?.toLowerCase(),
              callId: callData.callId,
            })
          }
        }

        // Hiển thị hộp thoại xác nhận (tùy chọn)
        // e.preventDefault();
        // e.returnValue = ""; // Chrome yêu cầu gán giá trị để hiện dialog
      }
    }

    // Thêm event listener vào cửa sổ popup
    if (popupWindow) {
      popupWindow.addEventListener("beforeunload", handleBeforeUnload)
    }

    // Cleanup
    return () => {
      if (popupWindow) {
        popupWindow.removeEventListener("beforeunload", handleBeforeUnload)
      }
    }
  }, [])

  // Animation keyframes as a string to be added to the document
  const animationKeyframes = `
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.4; }
      100% { opacity: 1; }
    }
  `

  // Add animation keyframes to document head
  useEffect(() => {
    if (popupDocument) {
      const styleElement = popupDocument.createElement("style")
      styleElement.textContent = animationKeyframes
      popupDocument.head.appendChild(styleElement)

      return () => {
        if (popupDocument.head.contains(styleElement)) {
          popupDocument.head.removeChild(styleElement)
        }
      }
    }
  }, [popupDocument])

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: 'turn:13.229.212.244:3478', username: 'luan', credential: 'luan921458' }
        ],
      },
    })

    peer.on("signal", (data) => {
      signalDataRef.current = data // Lưu dữ liệu tín hiệu vào ref
      // socketService.socket.emit("call-user", {
      //   userToCall: callData.receiverName?.toLowerCase(),
      //   signal: data,
      //   from: callData.callerId,
      //   callType: callData.callType,
      //   callerName: callData.callerName,
      // })
      sendCallSignal(data) // Gọi hàm gửi tín hiệu
      scheduleRetries(data) // Lên lịch thử lại nếu cần
    })

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream
        userVideo.current.muted = false

        // Ensure audio is actually playing
        userVideo.current.play().catch((err) => console.error("Error playing remote media:", err))
      }
    })

    connectionRef.current = peer
  }

  const answerCall = () => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: 'turn:13.229.212.244:3478', username: 'luan', credential: 'luan921458' }
        ],
      },
    })

    peer.on("signal", (data) => {
      socketService.socket.emit("call-accepted", {
        signal: data,
        to: callData.callerName?.toLowerCase(),
        callType: callData.callType,
        callId: callData.callId,
      })
    })

    peer.on("stream", (remoteStream) => {
      isConnectedRef.current = true
      // Tạo audio element riêng để đảm bảo âm thanh được xử lý
      // const audioElement = popupDocument.createElement('audio');
      // audioElement.id = 'caller-audio';
      // audioElement.srcObject = remoteStream;
      // audioElement.autoplay = true;
      // audioElement.play().catch(err => console.error("Error playing audio:", err));
      // popupDocument.body.appendChild(audioElement);

      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream
        userVideo.current.muted = false // Ensure not muted
        userVideo.current.play().catch((err) => console.error("Error playing remote video:", err))
      }
    })

    connectionRef.current = peer
    connectionRef.current.signal(callData.signal)
  }

  const toggleMute = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks()
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const remoteCallEnd = () => {
    closingDueToRemoteEnd.current = true
    setCallEnded(true)
    if (connectionRef.current) {
      connectionRef.current.destroy()
    }
    socketService.socket.off("call-ended", remoteCallEnd)
    setTimeout(() => {
      onClose()
    }, 10)
  }

  const endCall = () => {
    closingDueToRemoteEnd.current = false
    onClose()
    // if (connectionRef.current) {
    //   try {
    //     connectionRef.current.destroy();
    //   } catch (err) {
    //       console.error("Lỗi khi hủy kết nối:", err);
    //   } finally {
    //       connectionRef.current = null;  // Luôn reset reference
    //   }
    // }
    // if(callData.isReceivingCall) {
    //   socketService.socket.emit("call-ended", { to: callData.callerName?.toLowerCase(), callId: callData.callId })
    // } else {
    //   socketService.socket.emit("call-ended", { to: callData.receiverName?.toLowerCase(), callId: callData.callId })
    // }
  }

  // Styles object with responsive adjustments
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: Utils.isMobileDevice() ? (visualViewportHeight ? `${visualViewportHeight}px` : "100%") : "100%",
      width: "100%",
      backgroundColor: "#0f172a",
      color: "white",
      overflow: "hidden",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
      position: Utils.isMobileDevice() ? "fixed" : "relative",
      top: Utils.isMobileDevice() ? 0 : "auto",
      left: Utils.isMobileDevice() ? 0 : "auto",
      right: Utils.isMobileDevice() ? 0 : "auto",
      bottom: Utils.isMobileDevice() ? 0 : "auto",
      // Add safe area insets for notched phones
      paddingTop: "env(safe-area-inset-top, 0px)",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
      paddingLeft: "env(safe-area-inset-left, 0px)",
      paddingRight: "env(safe-area-inset-right, 0px)",
    },
    videoWrapper: {
      flex: 1,
      position: "relative",
      background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      overflow: "hidden",
    },
    remoteVideo: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      backgroundColor: "#000",
    },
    localVideoContainer: {
      position: "absolute",
      bottom: isLandscape ? "10px" : isMobile ? "90px" : "10px",
      right: isLocalVideoHidden ? "-200px" : (isMobile || isLandscape ? "10px" : "20px"),
      width: isMobile ? "30%" : isLandscape ? "20%" : "25%",
      maxWidth: isLandscape ? "150px" : "180px",
      minWidth: isMobile ? "80px" : "120px",
      // Use fixed aspect ratio for consistency
      aspectRatio: "3/4",
      borderRadius: "12px",
      overflow: "hidden",
      border: "2px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
      transition: "all 0.3s ease",
      zIndex: 10,
      backgroundColor: isVideoOff ? "#334155" : "#1e293b",
      display: isVideoOff ? "flex" : "block",
      alignItems: isVideoOff ? "center" : "initial",
      justifyContent: isVideoOff ? "center" : "initial",
    },
    toggleLocalVideoButton: {
      position: "fixed",
      bottom: "90px",
      right: isLocalVideoHidden ? "0px" : "-20px", // Slide in/out từ cạnh màn hình
      transform: "translateY(-50%)",
      width: "40px",
      height: "80px",
      borderRadius: "20px 0 0 20px", // Bo tròn bên trái
      backgroundColor: isLocalVideoHidden 
        ? "rgba(59, 130, 246, 0.9)" 
        : "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(8px)",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderRight: "none", // Không có border bên phải
      color: "white",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      // transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      zIndex: 50,
      boxShadow: isLocalVideoHidden 
        ? "-4px 0 20px rgba(59, 130, 246, 0.4)" 
        : "-2px 0 8px rgba(0, 0, 0, 0.3)",
      // Thêm pulse effect
      animation: isLocalVideoHidden ? "pulse 2s infinite" : "none",
    },
    localVideo: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    videoOffIndicator: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      color: "white",
    },
    callerInfo: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      width: "100%",
      padding: "0 20px",
    },
    callerAvatar: {
      width: isMobile ? "60px" : isTablet ? "80px" : "100px",
      height: isMobile ? "60px" : isTablet ? "80px" : "100px",
      borderRadius: "50%",
      backgroundColor: "#3b82f6",
      margin: `0 auto ${isLandscape ? "8px" : "16px"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isMobile ? "24px" : isTablet ? "32px" : "40px",
      fontWeight: "bold",
    },
    callerName: {
      fontSize: isMobile ? "18px" : isTablet ? "20px" : "24px",
      fontWeight: 600,
      marginBottom: isLandscape ? "4px" : "8px",
      wordBreak: "break-word",
    },
    callType: {
      fontSize: "16px",
      color: "#94a3b8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    callStatus: {
      position: "absolute",
      top: isMobile ? "10px" : "20px",
      left: isMobile ? "10px" : "20px",
      backgroundColor: "rgba(15, 23, 42, 0.7)",
      backdropFilter: "blur(8px)",
      padding: isMobile ? "6px 12px" : "8px 16px",
      borderRadius: "24px",
      fontSize: isMobile ? "12px" : "14px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      zIndex: 10,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    statusDot: {
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      backgroundColor: callAccepted ? "#10b981" : "#f59e0b",
      animation: !callAccepted ? "pulse 1.5s infinite" : "none",
    },
    controls: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: isMobile ? "8px" : isTablet ? "12px" : "16px",
      padding: isMobile
        ? "12px 4px 20px"
        : isTablet
          ? "12px 8px 16px"
          : isLandscape
            ? "12px 8px 16px"
            : "16px 8px 20px",
      backgroundColor: "rgba(15, 23, 42, 0.95)", // Increased opacity for better visibility
      backdropFilter: "blur(10px)",
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      zIndex: 20,
      position: Utils.isMobileDevice() ? "absolute" : "relative", // Changed based on device
      bottom: Utils.isMobileDevice() ? 0 : "auto",
      left: Utils.isMobileDevice() ? 0 : "auto",
      right: Utils.isMobileDevice() ? 0 : "auto",
      width: "100%",
    },
    controlButton: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: isMobile ? "50px" : isTablet ? "55px" : "60px",
      height: isMobile ? "50px" : isTablet ? "55px" : "60px",
      borderRadius: "50%",
      backgroundColor: "#334155",
      color: "white",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      margin: "0 4px", // Add some margin to ensure buttons don't touch on small screens
    },
    controlButtonHover: {
      transform: "scale(1.08)",
      backgroundColor: "#475569",
    },
    endCallButton: {
      backgroundColor: "#ef4444",
    },
    endCallButtonHover: {
      backgroundColor: "#dc2626",
    },
    buttonText: {
      marginTop: "4px",
      fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
      fontWeight: 500,
    },
    icon: {
      width: isMobile ? "20px" : isTablet ? "22px" : "24px",
      height: isMobile ? "20px" : isTablet ? "22px" : "24px",
    },
  }

  return (
    <div style={styles.container} ref={containerRef}>
      {!callAccepted && !callData.isReceivingCall && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "14px",
            zIndex: 100,
          }}
        >
          {retryCount > 0
            ? `Retry attempt ${retryCount}/${MAX_RETRIES}... Call ends in ${timeRemaining}s`
            : `Call will end in ${timeRemaining}s if not answered`}
        </div>
      )}
      <button
        style={styles.toggleLocalVideoButton}
        onClick={toggleLocalVideo}
        onTouchStart={(e) => {
          e.currentTarget.style.right = isLocalVideoHidden ? "-5px" : "-15px";
          e.currentTarget.style.backgroundColor = isLocalVideoHidden 
            ? "rgba(59, 130, 246, 1)" 
            : "rgba(0, 0, 0, 1)";
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.right = isLocalVideoHidden ? "-10px" : "-20px";
          e.currentTarget.style.backgroundColor = isLocalVideoHidden 
            ? "rgba(59, 130, 246, 0.9)" 
            : "rgba(0, 0, 0, 0.7)";
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.right = isLocalVideoHidden ? "-5px" : "-15px";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.right = isLocalVideoHidden ? "-10px" : "-20px";
        }}
        aria-label={isLocalVideoHidden ? "Show Local Video" : "Hide Local Video"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isLocalVideoHidden ? (
            <path d="M15 18l-6-6 6-6" />
          ) : (
            <path d="M9 18l6-6-6-6" />
          )}
        </svg>
      </button>
      <audio ref={waitingRingtoneRef} src={waitingRingtone} />
      <div style={styles.videoWrapper}>
        <video
          playsInline
          ref={userVideo}
          autoPlay
          style={{
            ...styles.remoteVideo,
            display: isConnectedRef.current ? "block" : "none",
          }}
        />
        {/* {callAccepted && !callEnded ? (
          <video playsInline ref={userVideo} autoPlay style={styles.remoteVideo} />
        ) : ( */}
        {!isConnectedRef.current && (
          <div style={styles.callerInfo}>
            <div style={styles.callerAvatar}>
              {(callData.receiverName || callData.receiverId || "").charAt(0).toUpperCase()}
            </div>
            <div style={styles.callerName}>Calling {callData.receiverName || callData.receiverId}...</div>
            <div style={styles.callType}>{callData.callType === "video" ? "Video Call" : "Voice Call"}</div>
          </div>
        )}

        {stream && (
          <div style={styles.localVideoContainer}>
            <video playsInline muted ref={myVideo} autoPlay style={styles.localVideo} />
            {isVideoOff && (
              <div style={styles.videoOffIndicator}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={isMobile ? "20px" : "24px"}
                  height={isMobile ? "20px" : "24px"}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                  <path d="M15 11v-1a4 4 0 0 0-8 0v1"></path>
                </svg>
              </div>
            )}
          </div>
        )}

        <div style={styles.callStatus}>
          <div style={styles.statusDot} />
          <span>{callAccepted ? "Connected" : callEnded ? "Call Ended" : "Ringing..."}</span>
        </div>
      </div>

      <div style={styles.controls}>
        <button
          style={styles.controlButton}
          onClick={toggleScreenShare}
          onTouchStart={(e) => {
            e.currentTarget.style.transform = styles.controlButtonHover.transform
            e.currentTarget.style.backgroundColor = styles.controlButtonHover.backgroundColor
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = "none"
            e.currentTarget.style.backgroundColor = styles.controlButton.backgroundColor
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = styles.controlButtonHover.transform
            e.currentTarget.style.backgroundColor = styles.controlButtonHover.backgroundColor
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "none"
            e.currentTarget.style.backgroundColor = styles.controlButton.backgroundColor
          }}
          aria-label={isScreenSharing ? "Stop Sharing" : "Share Screen"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={styles.icon.width}
            height={styles.icon.height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isScreenSharing ? (
              <>
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
                <line x1="18" y1="12" x2="6" y2="12"></line>
              </>
            ) : (
              <>
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </>
            )}
          </svg>
          <span style={styles.buttonText}>{isScreenSharing ? "Stop" : "Share"}</span>
        </button>

        <button
          style={styles.controlButton}
          onClick={toggleMute}
          onTouchStart={(e) => {
            e.currentTarget.style.transform = styles.controlButtonHover.transform
            e.currentTarget.style.backgroundColor = styles.controlButtonHover.backgroundColor
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = "none"
            e.currentTarget.style.backgroundColor = styles.controlButton.backgroundColor
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = styles.controlButtonHover.transform
            e.currentTarget.style.backgroundColor = styles.controlButtonHover.backgroundColor
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "none"
            e.currentTarget.style.backgroundColor = styles.controlButton.backgroundColor
          }}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={styles.icon.width}
            height={styles.icon.height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMuted ? (
              <>
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </>
            ) : (
              <>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </>
            )}
          </svg>
          <span style={styles.buttonText}>{isMuted ? "Unmute" : "Mute"}</span>
        </button>

        {callData.callType === "video" && (
          <button
            style={styles.controlButton}
            onClick={toggleVideo}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = styles.controlButtonHover.transform
              e.currentTarget.style.backgroundColor = styles.controlButtonHover.backgroundColor
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = "none"
              e.currentTarget.style.backgroundColor = styles.controlButton.backgroundColor
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = styles.controlButtonHover.transform
              e.currentTarget.style.backgroundColor = styles.controlButtonHover.backgroundColor
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "none"
              e.currentTarget.style.backgroundColor = styles.controlButton.backgroundColor
            }}
            aria-label={isVideoOff ? "Show Video" : "Hide Video"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={styles.icon.width}
              height={styles.icon.height}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isVideoOff ? (
                <>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                  <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
                </>
              ) : (
                <>
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </>
              )}
            </svg>
            <span style={styles.buttonText}>{isVideoOff ? "Show" : "Hide"}</span>
          </button>
        )}

        <button
          style={{
            ...styles.controlButton,
            backgroundColor: isFullscreen ? "#475569" : "#334155",
          }}
          onClick={toggleFullscreen}
          onTouchStart={(e) => {
            e.currentTarget.style.transform = styles.controlButtonHover.transform
            e.currentTarget.style.backgroundColor = styles.controlButtonHover.backgroundColor
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = "none"
            e.currentTarget.style.backgroundColor = isFullscreen ? "#475569" : "#334155"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = styles.controlButtonHover.transform
            e.currentTarget.style.backgroundColor = styles.controlButtonHover.backgroundColor
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "none"
            e.currentTarget.style.backgroundColor = isFullscreen ? "#475569" : "#334155"
          }}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={styles.icon.width}
            height={styles.icon.height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isFullscreen ? (
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
            ) : (
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            )}
          </svg>
          <span style={styles.buttonText}>{isFullscreen ? "Exit" : "Full"}</span>
        </button>

        <button
          style={{
            ...styles.controlButton,
            ...styles.endCallButton,
          }}
          onClick={endCall}
          onTouchStart={(e) => {
            e.currentTarget.style.transform = styles.controlButtonHover.transform
            e.currentTarget.style.backgroundColor = styles.endCallButtonHover.backgroundColor
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = "none"
            e.currentTarget.style.backgroundColor = styles.endCallButton.backgroundColor
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = styles.controlButtonHover.transform
            e.currentTarget.style.backgroundColor = styles.endCallButtonHover.backgroundColor
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "none"
            e.currentTarget.style.backgroundColor = styles.endCallButton.backgroundColor
          }}
          aria-label="End Call"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={styles.icon.width}
            height={styles.icon.height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path>
            <line x1="23" y1="1" x2="1" y2="23"></line>
          </svg>
          <span style={styles.buttonText}>End</span>
        </button>
      </div>
    </div>
  )
}

export default VideoCallWindow
