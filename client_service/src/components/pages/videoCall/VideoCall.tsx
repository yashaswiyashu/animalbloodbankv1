import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import socketInstance from '../../../socket';
import Peer from 'simple-peer';
import './video-call.css';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';

const VideoCall = () => {
  const context = useContext(AuthContext);
  const callData = JSON.parse(localStorage.getItem('callSessionMeta') || '{}');
  const UserData: any = context?.user;
  const socket = socketInstance.getSocket();

  // const [stream, setStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callIncoming, setCallIncoming] = useState(false);
  const [caller, setCaller] = useState<any>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [callEnded, setCallEnded] = useState(false);
  const [ me, setMe] = useState("");
  const [isInCall, setIsInCall] = useState(false);
  const [mainVideo, setMainVideo] = useState<"remote" | "self">("remote");
  const [isDoctorOnline, setIsDoctorOnline] = useState(false);

  const myVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<any>(null);
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (UserData.role === 'farmer') {
  //     callTarget();
  //   }
  // }, []);


  useEffect(() => {
    if (!UserData) return;
    socket.emit("join", {
      id: UserData.id,
      name: UserData.role === 'farmer' ? UserData.farmer_name : UserData.user_name,
      role: UserData.role
    });
    socket.emit("get-online-users");

    socket.on("update-online-users", (onlineUsers: any[]) => {
      const doctorOnline = onlineUsers.some(user => user.userId === callData.doctorId);
      setIsDoctorOnline(doctorOnline);
    });

    socket.on("me", (id: any) => {
      console.log("My socket ID:", id);
      setMe(id);
    });

    socket.on("connect", () => {
      console.log("Connected to socket.io");
    });

    socket.on("callToUser", (data: any) => {
      setCaller(data);
      setCallIncoming(true);
    });

    socket.on("callRejected", (data: any) => {
      alert(`Call rejected by ${data.name}`)
    })

    socket.on("toggle-video", (data: any) => {
      if (remoteVideo.current && remoteVideo.current.srcObject) {
        const remoteStream = remoteVideo.current.srcObject as MediaStream;
        remoteStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
          track.enabled = data.isEnabled;
        });
      }
    });

    socket.on("toggle-audio", (data: any) => {
      if (remoteVideo.current && remoteVideo.current.srcObject) {
        const remoteStream = remoteVideo.current.srcObject as MediaStream;
        remoteStream.getAudioTracks().forEach((track: MediaStreamTrack) => {
          track.enabled = data.isEnabled;
        });
      }
    });

    socket.on("callAccepted", (data: any) => {
      setCallAccepted(true);
      peerRef.current?.signal(data.signal);
    });

    socket.on("callEnded", () => {
      console.log("Call ended by the other user");
      
      setCallAccepted(false);
      setCallIncoming(false);
      setCallEnded(true);
      setVideoEnabled(true);
      setAudioEnabled(true);
      setIsInCall(false);
      setCaller(null);
      if (peerRef.current) peerRef.current.destroy();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (myVideo.current) myVideo.current.srcObject = null;
      if (remoteVideo.current) remoteVideo.current.srcObject = null;
      if (UserData.role === "farmer") {
        navigate('/my-bookings')
      } else {
        navigate('/doctor');
      }
      // endCall();
    });


    return () => {
      socket.removeAllListeners();
    };
  }, [socket, UserData]);

  const callTarget = async () => {
    if (!videoEnabled && !audioEnabled) {
      alert("Please turn on Video or Audio before making a call.");
      return;
    }
    
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({ video: videoEnabled, audio: audioEnabled });
      streamRef.current = currentStream;
      if (myVideo.current) myVideo.current.srcObject = currentStream;

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: currentStream
      });

      peer.on('signal', (data) => {
        socket.emit("callToUser", {
          signalData: data,
          from: me,
          name: UserData.role === 'farmer' ? UserData.farmer_name : UserData.user_name,
          callToUserId: callData.doctorId
        });
      });

      peer.on('stream', (remoteStream) => {
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = remoteStream;
        }
      });

      socket.once("callAccepted", (data: any) => {
        setCallAccepted(true);
        setIsInCall(true);
        setCaller(data);
      })

      peerRef.current = peer;
    } catch (err) {
      console.error('Permission denied', err);
    }
  };

  const rejectCall = () => {
    setCallIncoming(false);
    setCallAccepted(false);

    socket.emit("reject-call", {
      to: caller.from, name: UserData.username
    })
  };

  const answerCall = async () => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = currentStream;
      setCallAccepted(true);
      setCallIncoming(false);
      if (myVideo.current) myVideo.current.srcObject = currentStream;

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: currentStream
      });

      peer.on('signal', (data) => {
        socket.emit("answerCall", {
          signal: data,
          from: me,
          to: caller.from
        });
      });

      peer.on('stream', (remoteStream) => {
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = remoteStream;
        }
      });
      setIsInCall(true);
      peer.signal(caller.signal);
      peerRef.current = peer;
    } catch (err) {
      console.error('Permission denied', err);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => track.enabled = !videoEnabled);
      setVideoEnabled(!videoEnabled);
      if (callAccepted) {
        socket.emit("toggle-video", {
          to: caller?.from,
          from: UserData.id,
          isEnabled: !videoEnabled
        });
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => track.enabled = !audioEnabled);
      setAudioEnabled(!audioEnabled);
      if (callAccepted) {
        socket.emit("toggle-audio", {
          to: caller?.from,
          from: UserData.id,
          isEnabled: !audioEnabled
        });
      }
    }
  };

  const endCall = async () => {
    setCallEnded(true);
    setCallAccepted(false);
    setVideoEnabled(true);
    setAudioEnabled(true);
    setIsInCall(false);
    setCaller(null);
    if (peerRef.current) {
      peerRef.current.destroy();
    }

    if (remoteVideo.current) {
      remoteVideo.current.srcObject = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    console.log(caller, "caller");
    
    socket.emit("call-ended", {
      to: caller?.from,
      name: UserData.farmer_name,
    });

    try {
      const appointmentId = callData?.appointmentId;
      if (appointmentId) {
          UserData.role === "farmer"
            ? await api.farmer_api.put(`/appointment/complete/${appointmentId}`)
            : await api.doctor_api.put(`/appointment/complete/${appointmentId}`)

          console.log("Appointment status updated to completed.");
        }
    } catch (error) {
      console.error("Failed to mark appointment as completed:", error);
    }

    if (UserData.role === "farmer") {
      navigate('/my-bookings')
    } else {
      navigate('/doctor');
    }
  };

  return (
    <div className='center-page'>
      <div className="video-call-wrapper">
        <h2>
          Video Call with{" "}
          {UserData.role === "farmer"
            ? callData?.doctorName
            : callData?.farmerName}
        </h2>

        <div className="video-container">
          <div className="main-video">
            <video
              playsInline
              muted={mainVideo === "self"}
              autoPlay
              ref={mainVideo === "self" ? myVideo : remoteVideo}
              className="video-player"
              onClick={() =>
                setMainVideo((prev) => (prev === "self" ? "remote" : "self"))
              }
            />
          </div>

          <div className="pip-video">
            <video
              playsInline
              muted={mainVideo !== "self"}
              autoPlay
              ref={mainVideo !== "self" ? myVideo : remoteVideo}
              className="video-player-pip"
              onClick={() =>
                setMainVideo((prev) => (prev === "self" ? "remote" : "self"))
              }
            />
          </div>
        </div>

        {!streamRef.current && !callAccepted && !callIncoming && (
          <p>Waiting to initiate or receive call...</p>
        )}

        {!callAccepted && !callIncoming && UserData?.role === "farmer" && (
          <button
            className="action-btn"
            onClick={callTarget}
            disabled={!isDoctorOnline}
            style={{ backgroundColor: isDoctorOnline ? undefined : "#ccc", cursor: isDoctorOnline ? "pointer" : "not-allowed" }}
          >
            {isDoctorOnline ? "Call Doctor" : "Doctor Offline"}
          </button>
        )}

        {callIncoming && (
          <div className="incoming-call-overlay">
            <div className="incoming-call-popup">
              <h3>Incoming call from {caller.name}</h3>
              <div className="popup-buttons">
                <button className="popup-btn accept" onClick={answerCall}>Accept</button>
                <button className="popup-btn reject" onClick={rejectCall}>Reject</button>
              </div>
            </div>
          </div>
        )}

        {isInCall && (
          <>
            <div className="controls">
              <button className="control-btn" onClick={toggleVideo}>
                {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
              </button>
              <button className="control-btn" onClick={toggleAudio}>
                {audioEnabled ? <MicIcon /> : <MicOffIcon />}
              </button>
            </div>
            <div className='end-call-container'>
              <button onClick={endCall} className="end-call-button">
                <CallEndIcon />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
