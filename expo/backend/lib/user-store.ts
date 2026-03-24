import bcrypt from 'bcryptjs';
import { dbCreateUser, dbFindUserByEmail, dbFindUserById, dbGetAllUsers } from './db';

const PASSWORD_SALT_ROUNDS = Number(process.env.PASSWORD_SALT_ROUNDS || 10);

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
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

  async initialize() {
    if (this.initialized) {
      return;
    }

    try {
      const dbUsers = await dbGetAllUsers();
      console.log('[UserStore] Loading users from DB, found:', dbUsers.length);
      for (const record of dbUsers) {
        const user: User = {
          id: record.id,
          email: record.email,
          passwordHash: record.passwordHash,
          name: record.name,
          createdAt: record.createdAt,
        };
        if (user.id && user.email && user.passwordHash) {
          this.users.set(user.id, user);
        }
      }
      console.log('[UserStore] Loaded', this.users.size, 'users from DB');
    } catch (error) {
      console.error('[UserStore] Failed to load from DB, starting empty:', error);
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
          const passwordHash = await bcrypt.hash(seedPassword, PASSWORD_SALT_ROUNDS);
          const testUser: User = {
            id: 'test_user_1',
            email: normalizedSeedEmail,
            passwordHash,
            name: seedName.trim(),
            createdAt: new Date().toISOString(),
          };
          this.users.set(testUser.id, testUser);
          await dbCreateUser(testUser);
          console.log('[UserStore] Seed user created:', testUser.email);
        } catch (error) {
          console.error('[UserStore] Seed user creation failed:', error);
        }
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

    if (!existingUser) {
      const dbUser = await dbFindUserByEmail(normalizedEmail);
      if (dbUser) {
        existingUser = dbUser;
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
    await dbCreateUser(user);

    console.log('[UserStore] User created:', user.email);
    return user;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    await this.initialize();
    const normalizedEmail = normalizeEmail(email);

    let user = Array.from(this.users.values()).find(u => u.email === normalizedEmail);

    if (!user) {
      const dbUser = await dbFindUserByEmail(normalizedEmail);
      if (dbUser && dbUser.id && dbUser.passwordHash) {
        user = dbUser;
        this.users.set(user.id, user);
      }
    }

    return user;
  }

  async findUserById(id: string): Promise<User | undefined> {
    await this.initialize();

    let user = this.users.get(id);

    if (!user) {
      const dbUser = await dbFindUserById(id);
      if (dbUser) {
        user = dbUser;
        this.users.set(user.id, user);
      }
    }

    return user;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, user.passwordHash);
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
