import { Injectable } from '@angular/core';

const CACHE_VERSION = 'v2';
const VERSION_KEY = 'domoticore-cache:__version__';

@Injectable({ providedIn: 'root' })
export class LocalDataCacheService {
  private readonly prefix = 'domoticore-cache:';

  constructor() {
    this.bustIfStale();
  }

  getCollection<T>(key: string): T[] | null {
    return this.read<T[]>(key);
  }

  setCollection<T>(key: string, data: T[]): void {
    this.write(key, data);
  }

  getObject<T>(key: string): T | null {
    return this.read<T>(key);
  }

  setObject<T>(key: string, data: T): void {
    this.write(key, data);
  }

  clear(key: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(this.prefix + key);
  }

  clearAll(): void {
    if (typeof localStorage === 'undefined') return;
    Object.keys(localStorage)
      .filter(k => k.startsWith(this.prefix))
      .forEach(k => localStorage.removeItem(k));
  }

  private bustIfStale(): void {
    if (typeof localStorage === 'undefined') return;
    if (localStorage.getItem(VERSION_KEY) !== CACHE_VERSION) {
      this.clearAll();
      localStorage.setItem(VERSION_KEY, CACHE_VERSION);
    }
  }

  private read<T>(key: string): T | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(this.prefix + key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  private write<T>(key: string, data: T): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.prefix + key, JSON.stringify(data));
  }
}
