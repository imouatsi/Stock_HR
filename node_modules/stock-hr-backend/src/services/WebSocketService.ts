import { Server } from 'socket.io';
import { verifyToken } from '../middleware/auth';

export class WebSocketService {
  private io: Server;
  private userSockets: Map<string, Set<string>> = new Map();

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        const decoded = await verifyToken(token);
        socket.data.userId = decoded.id;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      const userId = socket.data.userId;
      this.addUserSocket(userId, socket.id);

      socket.on('disconnect', () => {
        this.removeUserSocket(userId, socket.id);
      });

      socket.on('join-room', (room) => {
        socket.join(room);
      });
    });
  }

  public broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }

  public sendToUser(userId: string, event: string, data: any) {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.forEach(socketId => {
        this.io.to(socketId).emit(event, data);
      });
    }
  }

  private addUserSocket(userId: string, socketId: string) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)?.add(socketId);
  }

  private removeUserSocket(userId: string, socketId: string) {
    this.userSockets.get(userId)?.delete(socketId);
    if (this.userSockets.get(userId)?.size === 0) {
      this.userSockets.delete(userId);
    }
  }
}
