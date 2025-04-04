export default class CacheService {
  private cache: Map<string, any>;

  constructor() {
    this.cache = new Map();
  }

  public get(key: string): any {
    return this.cache.get(key);
  }

  public set(key: string, value: any, ttl: number): void {
    this.cache.set(key, value);
    setTimeout(() => this.cache.delete(key), ttl * 1000);
  }
}
