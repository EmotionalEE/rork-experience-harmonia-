const DB_ENDPOINT = process.env.EXPO_PUBLIC_RORK_DB_ENDPOINT || '';
const DB_NAMESPACE = process.env.EXPO_PUBLIC_RORK_DB_NAMESPACE || '';
const DB_TOKEN = process.env.EXPO_PUBLIC_RORK_DB_TOKEN || '';

interface DbRecord {
  [key: string]: unknown;
}

function getHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${DB_TOKEN}`,
    'surreal-ns': DB_NAMESPACE,
    'surreal-db': 'main',
  };
}

async function querySql(sql: string): Promise<unknown[]> {
  if (!DB_ENDPOINT || !DB_TOKEN) {
    console.warn('[DB] Missing DB configuration, skipping query');
    return [];
  }

  const url = `${DB_ENDPOINT}/sql`;
  console.log('[DB] Executing query:', sql.substring(0, 100));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: sql,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[DB] Query failed:', response.status, text.substring(0, 200));
      return [];
    }

    const data = await response.json();
    console.log('[DB] Query result:', JSON.stringify(data).substring(0, 200));

    if (Array.isArray(data)) {
      const results: unknown[] = [];
      for (const entry of data) {
        if (entry?.result && Array.isArray(entry.result)) {
          results.push(...entry.result);
        } else if (entry?.result) {
          results.push(entry.result);
        }
      }
      return results;
    }

    return [];
  } catch (error) {
    console.error('[DB] Query error:', error);
    return [];
  }
}

function escapeString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

export async function dbCreateUser(user: {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}): Promise<boolean> {
  try {
    const safeId = escapeString(user.id);
    const safeEmail = escapeString(user.email);
    const safeHash = escapeString(user.passwordHash);
    const safeName = escapeString(user.name);
    const safeDate = escapeString(user.createdAt);

    const sql = `CREATE users SET userId = '${safeId}', email = '${safeEmail}', passwordHash = '${safeHash}', name = '${safeName}', createdAt = '${safeDate}';`;

    const result = await querySql(sql);
    console.log('[DB] User created in DB:', user.email, 'result:', JSON.stringify(result).substring(0, 200));
    return true;
  } catch (error) {
    console.error('[DB] Failed to create user in DB:', error);
    return false;
  }
}

export async function dbFindUserByEmail(email: string): Promise<DbRecord | null> {
  try {
    const sql = `SELECT * FROM users WHERE email = '${escapeString(email)}';`;
    const results = await querySql(sql);

    if (results.length > 0) {
      console.log('[DB] Found user in DB:', email);
      return results[0] as DbRecord;
    }

    console.log('[DB] User not found in DB:', email);
    return null;
  } catch (error) {
    console.error('[DB] Failed to find user in DB:', error);
    return null;
  }
}

export async function dbGetAllUsers(): Promise<DbRecord[]> {
  try {
    const sql = `SELECT * FROM users;`;
    const results = await querySql(sql);
    console.log('[DB] Loaded', results.length, 'users from DB');
    if (results.length > 0) {
      console.log('[DB] Sample user keys:', Object.keys(results[0] as object));
    }
    return results as DbRecord[];
  } catch (error) {
    console.error('[DB] Failed to load users from DB:', error);
    return [];
  }
}

export function isDbConfigured(): boolean {
  return !!(DB_ENDPOINT && DB_TOKEN && DB_NAMESPACE);
}
