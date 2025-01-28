import { DockerApp } from '../types';

const CACHE_KEY = 'docker_apps_cache';
const CACHE_EXPIRY = 1000 * 60 * 5; // 5 minutes

interface CacheData {
  timestamp: number;
  data: DockerApp[];
}

export const cacheService = {
  setApps(apps: DockerApp[]) {
    const cacheData: CacheData = {
      timestamp: Date.now(),
      data: apps,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  },

  getApps(): DockerApp[] | null {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const cacheData: CacheData = JSON.parse(cached);
    const isExpired = Date.now() - cacheData.timestamp > CACHE_EXPIRY;

    if (isExpired) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return cacheData.data;
  },

  clearCache() {
    localStorage.removeItem(CACHE_KEY);
  }
};