import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RoomList } from './features/chat/RoomList';
import { RoomDetail } from './features/chat/RoomDetail';
import { VideoCallPage } from './features/call/VideoCallPage';
import { CallProvider } from './context/CallContext';
import { IncomingCallAlert } from './features/call/IncomingCallAlert';

const RootLayout = () => (
  <CallProvider>
    <IncomingCallAlert />
    <Outlet />
  </CallProvider>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            element: <RoomList />,
          },
          {
            path: 'rooms/:roomId',
            element: <RoomDetail />,
          },
        ],
      },
      {
        path: '/rooms/:roomId/call',
        element: <VideoCallPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
