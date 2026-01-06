import React, { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import SimplePeer from 'simple-peer';
import Chat from './Chat';
import Canvas from './Canvas';
import type { CanvasHandle, DrawData } from './Canvas';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const socket: Socket = io(API_URL);

interface Peer {
  peerId: string;
  peer: SimplePeer.Instance;
}

const Room: React.FC = () => {
  const [stream, setStream] = useState<MediaStream>();
  const [peers, setPeers] = useState<Peer[]>([]);
  const [roomId, setRoomId] = useState<string>("test-room");
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  const userVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<Peer[]>([]);
  const canvasRef = useRef<CanvasHandle>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream);
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket.on("all users", (users: string[]) => {
      const peers: Peer[] = [];
      users.forEach((userID) => {
        const peer = createPeer(userID, socket.id!, stream!);
        peersRef.current.push({
          peerId: userID,
          peer,
        });
        peers.push({
            peerId: userID,
            peer
        });
      });
      setPeers(peers);
    });

    socket.on("user joined", (payload: { signal: any; callerID: string }) => {
      const peer = addPeer(payload.signal, payload.callerID, stream!);
      peersRef.current.push({
        peerId: payload.callerID,
        peer,
      });
      setPeers((users) => [...users, { peerId: payload.callerID, peer }]);
    });

    socket.on("receiving returned signal", (payload: { signal: any; id: string }) => {
      const item = peersRef.current.find((p) => p.peerId === payload.id);
      item?.peer.signal(payload.signal);
    });

    socket.on('user left', (id: string) => {
        const peerObj = peersRef.current.find(p => p.peerId === id);
        if(peerObj) {
            peerObj.peer.destroy();
        }
        peersRef.current = peersRef.current.filter(p => p.peerId !== id);
        setPeers(peers => peers.filter(p => p.peerId !== id));
    });

    return () => {
        socket.off('connect');
        socket.off('all users');
        socket.off('user joined');
        socket.off('receiving returned signal');
        socket.off('user left');
    }
  }, [stream]);

  function createPeer(userToSignal: string, callerID: string, stream: MediaStream) {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("sending signal", { userToSignal, callerID, signal });
    });

    peer.on("data", (data) => {
        const parsed = JSON.parse(data.toString());
        if(parsed.type === 'draw') {
             canvasRef.current?.drawRemote(parsed.data);
        }
    });

    return peer;
  }

  function addPeer(incomingSignal: any, callerID: string, stream: MediaStream) {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("returning signal", { signal, callerID });
    });

    peer.on("data", (data) => {
        const parsed = JSON.parse(data.toString());
        if(parsed.type === 'draw') {
             canvasRef.current?.drawRemote(parsed.data);
        }
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const joinRoom = () => {
      socket.emit('join room', roomId);
      setJoined(true);
  }

  const toggleMute = () => {
      if(stream) {
          stream.getAudioTracks().forEach(track => track.enabled = !muted);
          setMuted(!muted);
      }
  }

  const toggleVideo = () => {
      if(stream) {
          stream.getVideoTracks().forEach(track => track.enabled = !videoOff);
          setVideoOff(!videoOff);
      }
  }

  const handleBroadcastDraw = (data: DrawData) => {
      // Send to all peers
      peersRef.current.forEach(p => {
          try {
              p.peer.send(JSON.stringify({ type: 'draw', data }));
          } catch(err) {
              console.error("Error sending data to peer", err);
          }
      });
  }

  return (
    <div className="flex h-screen bg-gray-100 p-4 gap-4">
      <div className="flex-1 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">WebRTC Room: {roomId}</h1>

        {!joined && (
            <div className="mb-4">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="border p-2 mr-2 rounded"
                />
                <button onClick={joinRoom} className="bg-blue-500 text-white px-4 py-2 rounded">Join Room</button>
            </div>
        )}

        {joined && (
             <div className="flex gap-2 mb-4">
                <button onClick={toggleMute} className={`px-4 py-2 rounded ${muted ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                    {muted ? 'Unmute' : 'Mute'}
                </button>
                <button onClick={toggleVideo} className={`px-4 py-2 rounded ${videoOff ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                    {videoOff ? 'Start Video' : 'Stop Video'}
                </button>
             </div>
        )}

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="relative">
              <video playsInline muted ref={userVideo} autoPlay className="w-64 h-48 bg-black rounded object-cover" />
              <span className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 rounded">Me</span>
          </div>
          {peers.map((peer) => {
            return (
              <Video key={peer.peerId} peer={peer.peer} />
            );
          })}
        </div>

        {joined && <Canvas ref={canvasRef} onDraw={handleBroadcastDraw} width={600} height={400} />}
      </div>

      {joined && <Chat socket={socket} roomId={roomId} />}
    </div>
  );
};

const Video: React.FC<{ peer: SimplePeer.Instance }> = ({ peer }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    peer.on("stream", (stream) => {
      if(ref.current) ref.current.srcObject = stream;
    });
  }, [peer]);

  return (
     <div className="relative">
        <video playsInline autoPlay ref={ref} className="w-64 h-48 bg-black rounded" />
        <span className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 rounded">Peer</span>
     </div>
  );
};

export default Room;
