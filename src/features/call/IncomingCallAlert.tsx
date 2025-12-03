import { Phone, Video, X, PhoneIncoming } from 'lucide-react';
import { useCall } from '../../hooks/useCall';

export function IncomingCallAlert() {
  const { incomingCall, acceptCall, rejectCall } = useCall();

  if (!incomingCall) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-top-5 duration-300">
      <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center animate-pulse">
            <PhoneIncoming size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Incoming {incomingCall.type === 'video' ? 'Video' : 'Voice'} Call</h3>
            <p className="text-xs text-gray-400">{incomingCall.callerName}</p>
          </div>
        </div>
      </div>

      <div className="p-4 flex items-center justify-between gap-4 bg-white">
        <button
          onClick={rejectCall}
          className="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
            <X size={24} />
          </div>
          <span className="text-xs font-medium">Decline</span>
        </button>

        <button
          onClick={acceptCall}
          className="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
            {incomingCall.type === 'video' ? <Video size={24} /> : <Phone size={24} />}
          </div>
          <span className="text-xs font-medium">Accept</span>
        </button>
      </div>
    </div>
  );
}
