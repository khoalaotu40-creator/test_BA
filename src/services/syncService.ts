import { AppSyncData, UserProfile, VerificationData, RideShareItem } from '../types';
import { INITIAL_SYNC_DATA } from '../data/mockData';

const LOCAL_STORAGE_KEY = 'cogo_app_sync_v1';

export class SyncService {
  private static listeners: Array<(data: AppSyncData, isSyncing: boolean) => void> = [];
  private static isSyncing = false;

  public static subscribe(callback: (data: AppSyncData, isSyncing: boolean) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private static notify(data: AppSyncData) {
    this.listeners.forEach((cb) => cb(data, this.isSyncing));
  }

  public static getLocalData(): AppSyncData {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse local storage data', e);
    }
    return INITIAL_SYNC_DATA;
  }

  public static saveLocalData(data: AppSyncData): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      this.notify(data);
    } catch (e) {
      console.warn('Failed to save to local storage', e);
    }
  }

  // Pull latest data from server
  public static async pullFromServer(): Promise<AppSyncData> {
    this.isSyncing = true;
    const local = this.getLocalData();
    this.notify(local);

    try {
      const res = await fetch('/api/sync', {
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          const serverData: AppSyncData = {
            ...local,
            ...result.data,
            lastSyncedAt: new Date().toISOString(),
          };
          this.saveLocalData(serverData);
          this.isSyncing = false;
          this.notify(serverData);
          return serverData;
        }
      }
    } catch (err) {
      console.log('Server sync endpoint offline or unreachable, using local store', err);
    }

    this.isSyncing = false;
    this.notify(local);
    return local;
  }

  // Push updated data to server
  public static async pushToServer(updatedData: Partial<AppSyncData>): Promise<AppSyncData> {
    this.isSyncing = true;
    const current = this.getLocalData();
    const merged: AppSyncData = {
      ...current,
      ...updatedData,
      version: (current.version || 1) + 1,
      lastSyncedAt: new Date().toISOString(),
    };

    // Save locally first for instant optimistic response
    this.saveLocalData(merged);

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          const finalData: AppSyncData = {
            ...merged,
            ...result.data,
            lastSyncedAt: new Date().toISOString(),
          };
          this.saveLocalData(finalData);
          this.isSyncing = false;
          this.notify(finalData);
          return finalData;
        }
      }
    } catch (err) {
      console.log('Push to server delayed, saved in local store', err);
    }

    this.isSyncing = false;
    this.notify(merged);
    return merged;
  }

  // Reset data to default
  public static async resetToDefaults(): Promise<AppSyncData> {
    try {
      await fetch('/api/sync/reset', { method: 'POST' });
    } catch (e) {
      console.log('Server reset error', e);
    }
    const fresh = { ...INITIAL_SYNC_DATA, lastSyncedAt: new Date().toISOString() };
    this.saveLocalData(fresh);
    return fresh;
  }
}
