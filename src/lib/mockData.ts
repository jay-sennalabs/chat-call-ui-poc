export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface Room {
  id: string;
  name: string;
  type: 'direct' | 'group';
  messages: Message[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Token {
  token: string;
  serverUrl: string;
  roomName: string;
}

export const CURRENT_USER: User = {
  id: 'user_me',
  name: 'Jay Senna',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jay',
};

export const MOCK_USERS: Record<string, User> = {
  'user_alice': { id: 'user_alice', name: 'Alice', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
  'user_bob': { id: 'user_bob', name: 'Bob', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
  'user_charlie': { id: 'user_charlie', name: 'Charlie', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' },
};

