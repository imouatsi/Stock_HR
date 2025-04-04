import { v4 as uuidv4 } from 'uuid';

interface TelemetryEvent {
  id: string;
  timestamp: number;
  type: string;
  category: string;
  data: Record<string, any>;
  sessionId: string;
  userId?: string;
}

class Telemetry {
  private static instance: Telemetry;
  private sessionId: string;
  private queue: TelemetryEvent[] = [];
  private batchSize = 10;
  private flushInterval = 30000; // 30 seconds

  private constructor() {
    this.sessionId = uuidv4();
    this.setupPeriodicFlush();
  }

  public static getInstance(): Telemetry {
    if (!Telemetry.instance) {
      Telemetry.instance = new Telemetry();
    }
    return Telemetry.instance;
  }

  private setupPeriodicFlush() {
    setInterval(() => this.flush(), this.flushInterval);
  }

  public track(type: string, category: string, data: Record<string, any>, userId?: string) {
    const event: TelemetryEvent = {
      id: uuidv4(),
      timestamp: Date.now(),
      type,
      category,
      data,
      sessionId: this.sessionId,
      userId
    };

    this.queue.push(event);
    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  private async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events })
      });
    } catch (error) {
      console.error('Failed to send telemetry:', error);
      this.queue.unshift(...events);
    }
  }
}

export default Telemetry.getInstance();
