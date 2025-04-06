import { authService } from './authService';
import { EventEmitter } from 'events';

class SessionService {
  private static instance: SessionService;
  private eventEmitter: EventEmitter;
  private inactivityTimer: NodeJS.Timeout | null = null;
  private readonly INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes
  private readonly SESSION_CHECK_INTERVAL = 30 * 1000; // 30 seconds
  private sessionCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.eventEmitter = new EventEmitter();
    this.setupActivityListeners();
  }

  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  private setupActivityListeners(): void {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, () => this.resetInactivityTimer());
    });
  }

  public startSession(): void {
    this.resetInactivityTimer();
    this.startSessionCheck();
  }

  public endSession(): void {
    this.clearTimers();
    authService.logout();
  }

  private resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      this.eventEmitter.emit('sessionTimeout');
      this.endSession();
    }, this.INACTIVITY_TIMEOUT);
  }

  private startSessionCheck(): void {
    this.sessionCheckInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/auth/check-session', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          if (response.status === 409) {
            this.eventEmitter.emit('multipleDevices');
            this.endSession();
          } else {
            this.eventEmitter.emit('sessionInvalid');
            this.endSession();
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        this.endSession();
      }
    }, this.SESSION_CHECK_INTERVAL);
  }

  private clearTimers(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }

  public onSessionTimeout(callback: () => void): void {
    this.eventEmitter.on('sessionTimeout', callback);
  }

  public onMultipleDevices(callback: () => void): void {
    this.eventEmitter.on('multipleDevices', callback);
  }

  public onSessionInvalid(callback: () => void): void {
    this.eventEmitter.on('sessionInvalid', callback);
  }
}

export const sessionService = SessionService.getInstance(); 