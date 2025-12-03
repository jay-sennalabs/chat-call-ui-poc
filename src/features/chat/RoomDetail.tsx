import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CURRENT_USER, type Room } from '../../lib/mockData';
import { fetchChatRooms } from '../../lib/api';
import { Phone, Video, ArrowLeft, Send, PhoneIncoming } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCall } from '../../hooks/useCall';

export function RoomDetail() {
  const { roomId } = useParams();
  const { initiateCall, simulateIncomingCall } = useCall();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRoom() {
      if (!roomId) return;
      try {
        // In a real app, we would fetch a single room by ID
        const rooms = await fetchChatRooms();
        const foundRoom = rooms.find(r => r.id === roomId);
        if (foundRoom) {
          setRoom(foundRoom);
        } else {
          setError('Room not found');
        }
      } catch (err) {
        setError('Failed to load room details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadRoom();
  }, [roomId]);

  if (loading) {
    return <div className="text-center py-10">Loading room...</div>;
  }

  if (error || !room) {
    return <div className="text-center py-10">{error || 'Room not found'}</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="font-bold text-gray-900">{room.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => simulateIncomingCall({
              id: 'test-call',
              callerId: 'test-user',
              callerName: 'Test User',
              roomId: roomId!,
              type: 'video'
            })}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors mr-2 border border-dashed border-gray-300"
            title="Simulate Incoming Call (Dev)"
          >
            <PhoneIncoming size={16} />
            <span className="hidden sm:inline">Simulate Call</span>
          </button>

          <button
            onClick={() => initiateCall(roomId!, 'audio')}
            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors"
          >
            <Phone size={18} />
            <span className="hidden sm:inline">Voice</span>
          </button>

          <button
            onClick={() => initiateCall(roomId!, 'video')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg font-medium transition-colors"
          >
            <Video size={18} />
            <span className="hidden sm:inline">Video</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {room.messages.map((msg) => {
          const isMe = msg.senderId === CURRENT_USER.id;
          return (
            <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[70%] rounded-2xl px-4 py-2 text-sm",
                isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-gray-100 text-gray-900 rounded-bl-none"
              )}>
                <p>{msg.text}</p>
                <span className={cn("text-[10px] opacity-70 block mt-1", isMe ? "text-indigo-100" : "text-gray-500")}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area (Mock) */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        <button className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
