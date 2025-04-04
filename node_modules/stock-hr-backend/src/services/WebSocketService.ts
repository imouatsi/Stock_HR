import { Server, Socket } from 'socket.io';
import { verifyToken } from '../middleware/auth';
import { IUser } from '../models/user.model';

// Extend the Socket type to include a user property
interface SocketWithUser extends Socket {
  user?: IUser;
}

export class WebSocketService {
  private static instance: WebSocketService;
  private io: Server;
  private userSockets: Map<string, Set<string>> = new Map();

  private constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    this.io.use(async (socket: SocketWithUser, next) => {
      try {
        const token = socket.handshake.auth?.token;
        if (!token) {
          throw new Error('Authentication token is missing');
        }
        const user = await verifyToken(token);
        socket.user = user; // Assign the user to the custom property
        next();
      } catch (error) {
        next(error);
      }
    });

    this.setupEventHandlers();
  }

  public static getInstance(server?: any): WebSocketService {
    if (!WebSocketService.instance) {
      if (!server) {
        throw new Error('Server instance is required for the first initialization');
      }
      WebSocketService.instance = new WebSocketService(server);
    }
    return WebSocketService.instance;
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: SocketWithUser) => {
      const userId = socket.user?.id;
      if (userId) {
        this.addUserSocket(userId, socket.id);
      }

      socket.on('disconnect', () => {
        if (userId) {
          this.removeUserSocket(userId, socket.id);
        }
      });

      socket.on('join-room', (room: string) => {
        socket.join(room);
      });

      socket.on('get-user-id', () => {
        if (socket.user) {
          const userId = socket.user.id; // Safely access user.id
          console.log(`User ID: ${userId}`);
        } else {
          console.warn('User not authenticated');
        }
      });
    });
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

  public broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }

  public sendToUser(userId: string, event: string, data: any) {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.forEach((socketId) => {
        this.io.to(socketId).emit(event, data);
      });
    }
  }

  public sendToRoom(room: string, event: string, data: any) {
    this.io.to(room).emit(event, data);
  }
}
