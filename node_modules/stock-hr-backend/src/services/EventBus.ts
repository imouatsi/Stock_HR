import { EventEmitter } from 'events';
import { WebSocketService } from './WebSocketService';
import { CacheService } from './CacheService';

export class EventBus {
  private static instance: EventBus;
  private emitter: EventEmitter;
  private ws: WebSocketService;
  private cache: CacheService;

  private constructor() {
    this.emitter = new EventEmitter();
    this.ws = WebSocketService.getInstance();
    this.cache = CacheService.getInstance();
    this.setupHandlers();
  }

  private setupHandlers() {
    this.emitter.on('data:update', async (data) => {
      await this.cache.invalidate(data.key);
      this.ws.broadcast('update', data);
    });

    this.emitter.on('system:alert', (alert) => {
      this.ws.broadcast('alert', alert);
    });
  }

  public emit(event: string, data: any) {
    this.emitter.emit(event, data);
  }
}
