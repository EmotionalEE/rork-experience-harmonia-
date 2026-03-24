import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const USERS_STORAGE_KEY = "local_auth_users";

interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

async function hashPassword(password: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + "_harmonia_salt_v1"
  );
  return digest;
}

async function getAllUsers(): Promise<StoredUser[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredUser[];
  } catch (error) {
    console.error("[LocalAuth] Failed to load users:", error);
    return [];
  }
}

async function saveUsers(users: StoredUser[]): Promise<void> {
  await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function generateToken(userId: string, email: string): string {
  const payload = { userId, email, iat: Date.now() };
  return btoa(JSON.stringify(payload));
}

export async function signup(
  email: string,
  password: string,
  name: string
): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  console.log("[LocalAuth] Signup attempt:", normalizedEmail);

  const users = await getAllUsers();
  const existing = users.find((u) => u.email === normalizedEmail);

  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await hashPassword(password);
  const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const newUser: StoredUser = {
    id,
    email: normalizedEmail,
    name: trimmedName,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await saveUsers(users);

  const token = generateToken(id, normalizedEmail);
  console.log("[LocalAuth] Signup successful:", normalizedEmail);

  return {
    token,
    user: { id, email: normalizedEmail, name: trimmedName },
  };
}

export async function signin(
  email: string,
  password: string
): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();

  console.log("[LocalAuth] Signin attempt:", normalizedEmail);

  const users = await getAllUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordHash = await hashPassword(password);

  if (user.passwordHash !== passwordHash) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user.id, user.email);
  console.log("[LocalAuth] Signin successful:", normalizedEmail);

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name },
  };
}
