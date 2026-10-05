import { Server } from 'socket.io';

const SAMPLE_PASSAGES = [
  "The quick brown fox jumps over the lazy dog while neon lights illuminate the cybernetic highway of the future.",
  "Great coders do not just write code; they craft scalable architectures and empower human ingenuity across the globe.",
  "Speed and precision are the twin pillars of masterful typing, turning thoughts into digital realities at light speed.",
  "In the quiet of the night, keys click like raindrops on a tin roof, composing algorithms that will reshape tomorrow.",
  "Accelerate through the digital realm where every keystroke matters and victory belongs to the focused mind."
];

// In-memory room store
const rooms = new Map();

export const initRaceSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  const getRoomSummary = (roomId) => {
    const room = rooms.get(roomId);
    if (!room) return null;
    return {
      roomId: room.id,
      status: room.status, // 'waiting' | 'countdown' | 'in_progress' | 'finished'
      passage: room.passage,
      hostId: room.hostId,
      players: Array.from(room.players.values()),
      startTime: room.startTime,
      winner: room.winner
    };
  };

  io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // Create a new room
    socket.on('create_room', ({ playerName, avatar, carColor, customRoomId }) => {
      const roomId = customRoomId ? customRoomId.toUpperCase().trim() : `TAR-${Math.floor(100 + Math.random() * 900)}`;
      const passage = SAMPLE_PASSAGES[Math.floor(Math.random() * SAMPLE_PASSAGES.length)];

      const player = {
        id: socket.id,
        name: playerName || 'Racer',
        avatar: avatar || '🏎️',
        carColor: carColor || '#38bdf8',
        progress: 0,
        wpm: 0,
        accuracy: 100,
        isReady: true,
        isHost: true,
        finished: false,
        finishRank: null,
        finishTime: null
      };

      const room = {
        id: roomId,
        hostId: socket.id,
        status: 'waiting',
        passage,
        players: new Map([[socket.id, player]]),
        startTime: null,
        winner: null,
        countdown: 5
      };

      rooms.set(roomId, room);
      socket.join(roomId);
      socket.roomId = roomId;

      socket.emit('room_created', getRoomSummary(roomId));
      console.log(`[Socket] Room ${roomId} created by ${playerName} (${socket.id})`);
    });

    // Join an existing room
    socket.on('join_room', ({ roomId, playerName, avatar, carColor }) => {
      const cleanRoomId = (roomId || '').toUpperCase().trim();
      const room = rooms.get(cleanRoomId);

      if (!room) {
        return socket.emit('error_message', { message: 'Room not found. Check code or create new!' });
      }

      if (room.status !== 'waiting') {
        return socket.emit('error_message', { message: 'Race is already in progress or finished.' });
      }

      if (room.players.size >= 5) {
        return socket.emit('error_message', { message: 'Room is full (max 5 players).' });
      }

      const player = {
        id: socket.id,
        name: playerName || `Racer ${room.players.size + 1}`,
        avatar: avatar || '🏎️',
        carColor: carColor || '#f59e0b',
        progress: 0,
        wpm: 0,
        accuracy: 100,
        isReady: false,
        isHost: false,
        finished: false,
        finishRank: null,
        finishTime: null
      };

      room.players.set(socket.id, player);
      socket.join(cleanRoomId);
      socket.roomId = cleanRoomId;

      io.to(cleanRoomId).emit('room_updated', getRoomSummary(cleanRoomId));
      socket.emit('room_joined', getRoomSummary(cleanRoomId));
    });

    // Quick Match: Find waiting room or create one
    socket.on('quick_match', ({ playerName, avatar, carColor }) => {
      let foundRoomId = null;
      for (const [id, room] of rooms.entries()) {
        if (room.status === 'waiting' && room.players.size < 4) {
          foundRoomId = id;
          break;
        }
      }

      if (foundRoomId) {
        const room = rooms.get(foundRoomId);
        const player = {
          id: socket.id,
          name: playerName || `Racer ${room.players.size + 1}`,
          avatar: avatar || '🏎️',
          carColor: carColor || '#10b981',
          progress: 0,
          wpm: 0,
          accuracy: 100,
          isReady: true,
          isHost: false,
          finished: false,
          finishRank: null,
          finishTime: null
        };
        room.players.set(socket.id, player);
        socket.join(foundRoomId);
        socket.roomId = foundRoomId;

        io.to(foundRoomId).emit('room_updated', getRoomSummary(foundRoomId));
        socket.emit('room_joined', getRoomSummary(foundRoomId));
      } else {
        // Create new public room
        const roomId = `TAR-${Math.floor(100 + Math.random() * 900)}`;
        const passage = SAMPLE_PASSAGES[Math.floor(Math.random() * SAMPLE_PASSAGES.length)];
        const player = {
          id: socket.id,
          name: playerName || 'Racer 1',
          avatar: avatar || '🏎️',
          carColor: carColor || '#38bdf8',
          progress: 0,
          wpm: 0,
          accuracy: 100,
          isReady: true,
          isHost: true,
          finished: false,
          finishRank: null,
          finishTime: null
        };

        const room = {
          id: roomId,
          hostId: socket.id,
          status: 'waiting',
          passage,
          players: new Map([[socket.id, player]]),
          startTime: null,
          winner: null,
          countdown: 5
        };

        rooms.set(roomId, room);
        socket.join(roomId);
        socket.roomId = roomId;

        socket.emit('room_created', getRoomSummary(roomId));
      }
    });

    // Toggle Ready State
    socket.on('toggle_ready', () => {
      if (!socket.roomId) return;
      const room = rooms.get(socket.roomId);
      if (!room) return;

      const player = room.players.get(socket.id);
      if (player) {
        player.isReady = !player.isReady;
        io.to(room.id).emit('room_updated', getRoomSummary(room.id));
      }
    });

    // Start Countdown (Host trigger or Auto)
    socket.on('start_race', () => {
      if (!socket.roomId) return;
      const room = rooms.get(socket.roomId);
      if (!room || room.status !== 'waiting') return;

      room.status = 'countdown';
      let count = 5;
      io.to(room.id).emit('countdown_tick', { count });

      const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
          io.to(room.id).emit('countdown_tick', { count });
        } else {
          clearInterval(countdownInterval);
          room.status = 'in_progress';
          room.startTime = Date.now();
          io.to(room.id).emit('race_started', getRoomSummary(room.id));
        }
      }, 1000);
    });

    // Progress Update during Race
    socket.on('update_progress', ({ progress, wpm, accuracy }) => {
      if (!socket.roomId) return;
      const room = rooms.get(socket.roomId);
      if (!room || room.status !== 'in_progress') return;

      const player = room.players.get(socket.id);
      if (player && !player.finished) {
        player.progress = Math.min(100, Math.max(0, progress));
        player.wpm = wpm || 0;
        player.accuracy = accuracy || 100;

        io.to(room.id).emit('progress_broadcast', {
          playerId: socket.id,
          progress: player.progress,
          wpm: player.wpm,
          accuracy: player.accuracy
        });
      }
    });

    // Player Finish
    socket.on('player_finished', ({ wpm, accuracy }) => {
      if (!socket.roomId) return;
      const room = rooms.get(socket.roomId);
      if (!room) return;

      const player = room.players.get(socket.id);
      if (player && !player.finished) {
        player.finished = true;
        player.progress = 100;
        player.wpm = wpm || 0;
        player.accuracy = accuracy || 100;
        player.finishTime = Date.now() - (room.startTime || Date.now());

        const finishedCount = Array.from(room.players.values()).filter(p => p.finished).length;
        player.finishRank = finishedCount;

        if (finishedCount === 1) {
          room.winner = player;
        }

        io.to(room.id).emit('player_completed', {
          player,
          rank: player.finishRank
        });

        // If all players finished, set room status finished
        if (finishedCount === room.players.size) {
          room.status = 'finished';
          io.to(room.id).emit('race_ended', getRoomSummary(room.id));
        }
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
      if (socket.roomId) {
        const room = rooms.get(socket.roomId);
        if (room) {
          room.players.delete(socket.id);
          if (room.players.size === 0) {
            rooms.delete(socket.roomId);
          } else {
            // Transfer host if host left
            if (room.hostId === socket.id) {
              const remainingPlayers = Array.from(room.players.values());
              room.hostId = remainingPlayers[0].id;
              remainingPlayers[0].isHost = true;
            }
            io.to(socket.roomId).emit('room_updated', getRoomSummary(socket.roomId));
          }
        }
      }
    });
  });

  return io;
};
