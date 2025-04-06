import { EventEmitter } from 'events';
import api from './api';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  type: 'text' | 'screenshot';
  imageUrl?: string;
  timestamp: Date;
  read: boolean;
}

class MessagingService {
  private static instance: MessagingService;
  private eventEmitter: EventEmitter;
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;

  private constructor() {
    this.eventEmitter = new EventEmitter();
    this.initializeWebSocket();
  }

  public static getInstance(): MessagingService {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService();
    }
    return MessagingService.instance;
  }

  private initializeWebSocket(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.socket = new WebSocket(`ws://${window.location.host}/ws/messages?token=${token}`);

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.eventEmitter.emit('newMessage', message);
    };

    this.socket.onclose = () => {
      if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.initializeWebSocket();
        }, 1000 * Math.pow(2, this.reconnectAttempts));
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  public async sendMessage(recipientId: string, content: string, type: 'text' | 'screenshot' = 'text', imageFile?: File): Promise<Message> {
    try {
      let imageUrl: string | undefined;

      if (type === 'screenshot' && imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadResponse = await api.post('/api/messages/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = uploadResponse.data.url;
      }

      const response = await api.post('/api/messages', {
        recipientId,
        content,
        type,
        imageUrl
      });

      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  public async getMessages(): Promise<Message[]> {
    try {
      const response = await api.get('/api/messages');
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  public async markAsRead(messageId: string): Promise<void> {
    try {
      await api.put(`/api/messages/${messageId}/read`);
      this.eventEmitter.emit('messageRead', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  public onNewMessage(callback: (message: Message) => void): void {
    this.eventEmitter.on('newMessage', callback);
  }

  public onMessageRead(callback: (messageId: string) => void): void {
    this.eventEmitter.on('messageRead', callback);
  }

  public cleanup(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.eventEmitter.removeAllListeners();
  }
}

export const messagingService = MessagingService.getInstance(); 