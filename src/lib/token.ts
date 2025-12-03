import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple JWT implementation for client-side POC only
// WARNING: This exposes your API Secret to the client. Do not use in production.
export async function generateToken(
  roomId: string,
  participantId: string,
  participantName: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_LIVEKIT_API_KEY;
  const apiSecret = import.meta.env.VITE_LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('Missing LiveKit API Key or Secret');
  }

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
    iss: apiKey,
    sub: participantId,
    nbf: Math.floor(Date.now() / 1000),
    video: {
      room: roomId,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    },
    name: participantName,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const signature = await sign(
    `${encodedHeader}.${encodedPayload}`,
    apiSecret
  );

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function sign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const dataToSign = encoder.encode(data);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, dataToSign);

  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
