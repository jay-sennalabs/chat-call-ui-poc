import { type Room } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchChatRooms(): Promise<Room[]> {
  const response = await fetch(`${API_BASE_URL}/chat-rooms`);
  if (!response.ok) {
    throw new Error('Failed to fetch chat rooms');
  }
  const data = await response.json();
  return data.map((room: Room) => ({
    ...room,
    avatarUrl: 'https://via.placeholder.com/150',
    lastMessage: 'Last message text',
    lastMessageTime: new Date().toISOString(),
    unreadCount: 0,
    messages: []
  }));
}

export async function fetchLiveKitToken(roomId: string, userId: string, userName: string): Promise<{ token: string, serverUrl: string, roomName: string }> {
  const response = await fetch(`${API_BASE_URL}/livekit/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ roomId, userId, userName }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch LiveKit token');
  }
  const data = await response.json();
  return data;
}
