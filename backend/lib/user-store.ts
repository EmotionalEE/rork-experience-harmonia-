import bcrypt from 'bcryptjs';
import { dbCreateUser, dbFindUserByEmail, dbGetAllUsers, isDbConfigured } from './db';

const PASSWORD_SALT_ROUNDS = Number(process.env.PASSWORD_SALT_ROUNDS || 10);

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toStr(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return value.toString();
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.id === 'string') return obj.id;
  }
  return JSON.stringify(value);
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

class UserStore {
  private users: Map<string, User> = new Map();
  private initialized: boolean = false;
  private dbAvailable: boolean = false;

  async initialize() {
    if (this.initialized) {
      console.log('[UserStore] Already initialized');
      return;
    }

    this.dbAvailable = isDbConfigured();
    console.log('[UserStore] DB configured:', this.dbAvailable);

    if (this.dbAvailable) {
      try {
        const dbUsers = await dbGetAllUsers();
        console.log('[UserStore] Loading users from DB, found:', dbUsers.length);
        for (const record of dbUsers) {
          console.log('[UserStore] Raw DB record:', JSON.stringify(record).substring(0, 300));
          const rawId = record.userId || record.id;
          const user: User = {
            id: toStr(rawId),
            email: toStr(record.email),
            passwordHash: toStr(record.passwordHash),
            name: toStr(record.name),
            createdAt: toStr(record.createdAt),
          };
          console.log('[UserStore] Parsed user:', user.email, 'id:', user.id, 'hashLen:', user.passwordHash.length);
          if (user.id && user.email && user.passwordHash) {
            this.users.set(user.id, user);
          } else {
            console.warn('[UserStore] Skipping invalid user record - missing fields:', { id: !!user.id, email: !!user.email, hash: !!user.passwordHash });
          }
        }
        console.log('[UserStore] Loaded', this.users.size, 'users from DB');
      } catch (error) {
        console.error('[UserStore] Failed to load from DB, starting empty:', error);
      }
    }

    const seedEmail = process.env.SEED_USER_EMAIL;
    const seedPassword = process.env.SEED_USER_PASSWORD;
    const seedName = process.env.SEED_USER_NAME || 'Seed User';

    if (seedEmail && seedPassword) {
      const normalizedSeedEmail = normalizeEmail(seedEmail);
      const existingSeed = Array.from(this.users.values()).find(u => u.email === normalizedSeedEmail);
      if (!existingSeed) {
        console.log('[UserStore] Creating seed user...');
        try {
          const testPassword = await bcrypt.hash(seedPassword, PASSWORD_SALT_ROUNDS);
          const testUser: User = {
            id: 'test_user_1',
            email: normalizedSeedEmail,
            passwordHash: testPassword,
            name: seedName.trim(),
            createdAt: new Date().toISOString(),
          };
          this.users.set(testUser.id, testUser);
          if (this.dbAvailable) {
            await dbCreateUser(testUser);
          }
          console.log('[UserStore] Seed user created:', testUser.email);
        } catch (error) {
          console.error('[UserStore] Seed user creation failed:', error);
        }
      } else {
        console.log('[UserStore] Seed user already exists');
      }
    }

    this.initialized = true;
    console.log('[UserStore] Initialized. Total users:', this.users.size);
  }

  async createUser(email: string, password: string, name: string): Promise<User> {
    await this.initialize();

    const normalizedEmail = normalizeEmail(email);
    const normalizedName = name.trim();

    let existingUser = Array.from(this.users.values()).find(u => u.email === normalizedEmail);

    if (!existingUser && this.dbAvailable) {
      const dbUser = await dbFindUserByEmail(normalizedEmail);
      if (dbUser) {
        existingUser = {
          id: toStr(dbUser.id),
          email: toStr(dbUser.email),
          passwordHash: toStr(dbUser.passwordHash),
          name: toStr(dbUser.name),
          createdAt: toStr(dbUser.createdAt),
        };
        this.users.set(existingUser.id, existingUser);
      }
    }

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      email: normalizedEmail,
      passwordHash,
      name: normalizedName,
      createdAt: new Date().toISOString(),
    };

    this.users.set(user.id, user);

    if (this.dbAvailable) {
      const saved = await dbCreateUser(user);
      console.log('[UserStore] User saved to DB:', saved);
    }

    console.log('[UserStore] User created:', user.email);
    return user;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    await this.initialize();
    const normalizedEmail = normalizeEmail(email);

    let user = Array.from(this.users.values()).find(u => u.email === normalizedEmail);

    if (!user && this.dbAvailable) {
      console.log('[UserStore] User not in memory, checking DB for:', normalizedEmail);
      const dbUser = await dbFindUserByEmail(normalizedEmail);
      if (dbUser) {
        console.log('[UserStore] Raw DB user found:', JSON.stringify(dbUser).substring(0, 300));
        const rawId = dbUser.userId || dbUser.id;
        user = {
          id: toStr(rawId),
          email: toStr(dbUser.email),
          passwordHash: toStr(dbUser.passwordHash),
          name: toStr(dbUser.name),
          createdAt: toStr(dbUser.createdAt),
        };
        if (user.id && user.passwordHash) {
          this.users.set(user.id, user);
          console.log('[UserStore] Loaded user from DB:', user.email, 'hashLen:', user.passwordHash.length);
        } else {
          console.error('[UserStore] DB user has missing id or passwordHash');
          user = undefined;
        }
      }
    }

    console.log(`[UserStore] findUserByEmail(${normalizedEmail}): ${user ? 'found' : 'not found'}`);
    console.log(`[UserStore] Total users in store: ${this.users.size}`);
    if (user) {
      console.log(`[UserStore] User details - id: ${user.id}, email: ${user.email}, hashLen: ${user.passwordHash.length}, hashStart: ${user.passwordHash.substring(0, 7)}`);
    }
    return user;
  }

  async findUserById(id: string): Promise<User | undefined> {
    await this.initialize();
    return this.users.get(id);
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    console.log(`[UserStore] Verifying password for ${user.email}, hashLen: ${user.passwordHash.length}, hashStart: ${user.passwordHash.substring(0, 7)}`);
    try {
      const result = await bcrypt.compare(password, user.passwordHash);
      console.log(`[UserStore] Password verification result: ${result}`);
      return result;
    } catch (error) {
      console.error('[UserStore] Password verification error:', error);
      return false;
    }
  }

  async getAllUsers(): Promise<User[]> {
    await this.initialize();
    return Array.from(this.users.values());
  }
}

export const userStore = new UserStore();
