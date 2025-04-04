import Redis from 'ioredis';
import logger from './logger';

class Cache {
  private client: Redis;
  private static instance: Cache;

  private constructor() {
    this.client = new Redis(process.env.REDIS_URL!);
    
    this.client.on('error', (error) => {
      logger.error('Redis Client Error:', error);
    });
  }

  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  async set(key: string, value: any, expireIn?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (expireIn) {
        await this.client.setex(key, expireIn, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error) {
      logger.error('Cache Set Error:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache Get Error:', error);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error('Cache Delete Error:', error);
    }
  }
}

export default Cache.getInstance();
