import { getStore } from '@netlify/blobs';

interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

function getUserStore() {
  return getStore({ name: 'users', consistency: 'strong' });
}

export async function dbCreateUser(user: StoredUser): Promise<boolean> {
  try {
    const store = getUserStore();
    // Store by email (primary lookup key) and by ID (secondary)
    await store.setJSON(`email:${user.email}`, user);
    await store.set(`id:${user.id}`, user.email);
    console.log('[DB] User saved to Netlify Blobs:', user.email);
    return true;
  } catch (error) {
    console.error('[DB] Failed to save user:', error);
    return false;
  }
}

export async function dbFindUserByEmail(email: string): Promise<StoredUser | null> {
  try {
    const store = getUserStore();
    const user = await store.get(`email:${email}`, { type: 'json' }) as StoredUser | null;
    if (user) {
      console.log('[DB] Found user in Blobs:', email);
      return user;
    }
    console.log('[DB] User not found in Blobs:', email);
    return null;
  } catch (error) {
    console.error('[DB] Failed to find user:', error);
    return null;
  }
}

export async function dbFindUserById(id: string): Promise<StoredUser | null> {
  try {
    const store = getUserStore();
    const email = await store.get(`id:${id}`, { type: 'text' });
    if (!email) {
      return null;
    }
    return dbFindUserByEmail(email);
  } catch (error) {
    console.error('[DB] Failed to find user by ID:', error);
    return null;
  }
}

export async function dbGetAllUsers(): Promise<StoredUser[]> {
  try {
    const store = getUserStore();
    const { blobs } = await store.list({ prefix: 'email:' });
    const users: StoredUser[] = [];
    for (const blob of blobs) {
      const user = await store.get(blob.key, { type: 'json' }) as StoredUser | null;
      if (user) {
        users.push(user);
      }
    }
    console.log('[DB] Loaded', users.length, 'users from Netlify Blobs');
    return users;
  } catch (error) {
    console.error('[DB] Failed to load users:', error);
    return [];
  }
}

export function isDbConfigured(): boolean {
  return true;
}
