import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (
  window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin
);

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('[SocketService] Connected with ID:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SocketService] Disconnected:', reason);
    });

    return this.socket;
  }

  getSocket() {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  createRoom(payload) {
    this.getSocket().emit('create_room', payload);
  }

  joinRoom(payload) {
    this.getSocket().emit('join_room', payload);
  }

  quickMatch(payload) {
    this.getSocket().emit('quick_match', payload);
  }

  toggleReady() {
    this.getSocket().emit('toggle_ready');
  }

  startRace() {
    this.getSocket().emit('start_race');
  }

  updateProgress(progressData) {
    this.getSocket().emit('update_progress', progressData);
  }

  playerFinished(stats) {
    this.getSocket().emit('player_finished', stats);
  }
}

export const socketService = new SocketService();
