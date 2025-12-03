import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type Room } from '../../lib/mockData';
import { fetchChatRooms } from '../../lib/api';
import { Users, User } from 'lucide-react';

export function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await fetchChatRooms();
        setRooms(data.map(r => ({
          ...r,
          avatarUrl: 'https://via.placeholder.com/150',
          lastMessage: 'Last message text',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          messages: []
        })));
      } catch (err) {
        setError('Failed to load chat rooms');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadRooms();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading chats...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  console.log(rooms)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Your Chats</h1>
      <div className="grid gap-4">
        {rooms.map((room) => (
          <Link
            key={room.id}
            to={`/rooms/${room.id}`}
            className="block bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                {room.type === 'group' ? <Users size={24} /> : <User size={24} />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{room.name}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {room.messages[room.messages.length - 1]?.text || 'No messages yet'}
                </p>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(room.messages[room.messages.length - 1]?.timestamp || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
