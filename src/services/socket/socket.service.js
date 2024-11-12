import { BASE_ENDPOINT } from '@services/axios';
import { io } from 'socket.io-client';

class SocketService {
  socket;

  setupSocketConnection() {
    this.socket = io(BASE_ENDPOINT, {
      transports: ['websocket'],
      secure: true
    });
    this.socketConnectionEvents();
  }

  socketConnectionEvents() {
    this.socket.on('connect', () => {
      console.log('connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Reason: ${reason}`);
      // this.socket.connect();
    });

    this.socket.on('connect_error', (error) => {
      console.log(`Error: ${error}`);
      this.socket.connect();
    });
  }

  removeAllListeners() {
    const events = this.socket._callbacks ? Object.keys(this.socket._callbacks) : [];
    events.forEach(event => {
      this.socket.off(event.replace('$', ''));
    });
  }
}

export const socketService = new SocketService();
