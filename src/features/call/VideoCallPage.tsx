import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  LiveKitRoom,
  VideoConference,
  PreJoin,
  type LocalUserChoices,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { AlertCircle, Loader2 } from 'lucide-react';
import { fetchLiveKitToken } from '../../lib/api';
import { CURRENT_USER, type Token } from '../../lib/mockData';


export function VideoCallPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const callType = searchParams.get('type') as 'video' | 'audio' || 'video';

  const [token, setToken] = useState<Token | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [preJoinChoices, setPreJoinChoices] = useState<LocalUserChoices | null>(null);

  useEffect(() => {
    async function loadToken() {
      if (!roomId) return;
      setIsLoading(true);
      try {
        const fetchedToken = await fetchLiveKitToken(roomId, CURRENT_USER.id, CURRENT_USER.name);
        setToken(fetchedToken);
      } catch (err) {
        console.error('Failed to fetch token:', err);
        setError('Failed to connect to the call service.');
      } finally {
        setIsLoading(false);
      }
    }

    loadToken();
  }, [roomId]);


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 p-4 text-center bg-gray-950 text-white">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold">Connection Failed</h2>
        <p className="text-gray-400 max-w-md">{error}</p>
        <button
          onClick={() => navigate(`/rooms/${roomId}`)}
          className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors"
        >
          Back to Chat
        </button>
      </div>
    );
  }

  if (isLoading || !token) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-950 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-gray-400">Connecting to secure room...</p>
      </div>
    );
  }

  if (!preJoinChoices) {
    return (
      <div className="h-screen w-full bg-gray-950 flex flex-col items-center justify-center p-4" data-lk-theme="default">
        <div className="w-full max-w-4xl bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Join {callType === 'video' ? 'Video' : 'Voice'} Call</h2>
              <p className="text-gray-400">Set up your {callType === 'video' ? 'camera and ' : ''}microphone</p>
            </div>
            <button
              onClick={() => navigate(`/rooms/${roomId}`)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
          <div className="p-6 flex justify-center">
            <PreJoin
              onError={(err) => console.error("PreJoin error:", err)}
              defaults={{
                audioDeviceId: "",
                videoDeviceId: "",
                audioEnabled: true,
                videoEnabled: callType === 'video',
                username: CURRENT_USER.name,
              }}
              onSubmit={(values) => {
                setPreJoinChoices(values);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-950 flex flex-col" data-lk-theme="default">
      <LiveKitRoom
        video={preJoinChoices.videoEnabled}
        audio={preJoinChoices.audioEnabled}
        token={token.token}
        serverUrl={token.serverUrl}
        connect={true}
        options={{
          audioCaptureDefaults: {
            deviceId: preJoinChoices.audioDeviceId,
          },
          videoCaptureDefaults: {
            deviceId: preJoinChoices.videoDeviceId,
          },
        }}
        onDisconnected={() => navigate(`/rooms/${roomId}`)}
        onError={(err) => {
          console.error('LiveKit Room Error:', err);
          setError('Disconnected from the room.');
        }}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}
