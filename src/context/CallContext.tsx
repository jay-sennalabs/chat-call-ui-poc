import { createContext, useState, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type CallType = 'video' | 'audio';
export type CallStatus = 'idle' | 'calling' | 'incoming' | 'connected' | 'ended';

export interface IncomingCall {
  id: string;
  callerId: string;
  callerName: string;
  roomId: string;
  type: CallType;
}

interface CallContextType {
  callStatus: CallStatus;
  incomingCall: IncomingCall | null;
  initiateCall: (roomId: string, type: CallType) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  simulateIncomingCall: (call: IncomingCall) => void; // For testing
}

// eslint-disable-next-line react-refresh/only-export-components
export const CallContext = createContext<CallContextType | undefined>(undefined);

export function CallProvider({ children }: { children: ReactNode }) {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const navigate = useNavigate();

  const initiateCall = useCallback((roomId: string, type: CallType) => {
    setCallStatus('calling');
    // In a real app, this would send a signal to the server
    // For now, we just navigate to the room immediately for the caller
    // But to simulate "calling" state, we could wait or just go.
    // For this POC, let's just go to the call page.

    // We pass the type as state to the location or query param
    navigate(`/rooms/${roomId}/call?type=${type}`);
    setCallStatus('connected'); // Assumes immediate join for caller
  }, [navigate]);

  const acceptCall = useCallback(() => {
    if (incomingCall) {
      setCallStatus('connected');
      navigate(`/rooms/${incomingCall.roomId}/call?type=${incomingCall.type}`);
      setIncomingCall(null);
    }
  }, [incomingCall, navigate]);

  const rejectCall = useCallback(() => {
    setCallStatus('idle');
    setIncomingCall(null);
  }, []);

  const endCall = useCallback(() => {
    setCallStatus('idle');
    setIncomingCall(null);
    // Navigation back is handled by the page usually, but we can enforce it here if needed
  }, []);

  const simulateIncomingCall = useCallback((call: IncomingCall) => {
    setIncomingCall(call);
    setCallStatus('incoming');
  }, []);

  return (
    <CallContext.Provider
      value={{
        callStatus,
        incomingCall,
        initiateCall,
        acceptCall,
        rejectCall,
        endCall,
        simulateIncomingCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

