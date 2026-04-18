import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

/**
 * Returns the active Socket.io connection, creating one if it doesn't exist.
 * Authenticated with the stored JWT access token.
 */
export const getSocket = (): Socket => {
  if (!socket || !socket.connected) {
    const token = localStorage.getItem('accessToken');
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

/**
 * Disconnects and destroys the socket instance.
 * Call on logout.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Re-connects with a fresh token.
 * Useful when the access token has been refreshed.
 */
export const reconnectSocket = () => {
  disconnectSocket();
  return getSocket();
};

export default getSocket;
