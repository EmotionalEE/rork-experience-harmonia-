const DB_ENDPOINT = process.env.EXPO_PUBLIC_RORK_DB_ENDPOINT || '';
const DB_NAMESPACE = process.env.EXPO_PUBLIC_RORK_DB_NAMESPACE || '';
const DB_TOKEN = process.env.EXPO_PUBLIC_RORK_DB_TOKEN || '';

interface DbRecord {
  [key: string]: unknown;
}

function getHeaders(contentType?: string): Record<string, string> {
  return {
    'Content-Type': contentType || 'application/json',
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
      headers: getHeaders('application/json'),
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

async function restCreateRecord(table: string, data: Record<string, unknown>): Promise<unknown> {
  if (!DB_ENDPOINT || !DB_TOKEN) {
    console.warn('[DB] Missing DB configuration, skipping create');
    return null;
  }

  const url = `${DB_ENDPOINT}/key/${table}`;
  console.log('[DB] REST creating record in', table);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders('application/json'),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[DB] REST create failed:', response.status, text.substring(0, 300));
      return null;
    }

    const result = await response.json();
    console.log('[DB] REST create result:', JSON.stringify(result).substring(0, 300));
    return result;
  } catch (error) {
    console.error('[DB] REST create error:', error);
    return null;
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
    const record = {
      userId: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      name: user.name,
      createdAt: user.createdAt,
    };

    console.log('[DB] Creating user via REST API:', user.email, 'hashLen:', user.passwordHash.length);
    const result = await restCreateRecord('users', record);
    console.log('[DB] User created in DB:', user.email, 'result:', JSON.stringify(result).substring(0, 300));

    const verifyUser = await dbFindUserByEmail(user.email);
    if (verifyUser) {
      const rawHash = verifyUser.passwordHash;
      const storedHash = typeof rawHash === 'string' ? rawHash : JSON.stringify(rawHash) ?? '';
      if (storedHash === user.passwordHash) {
        console.log('[DB] Hash verification PASSED for:', user.email);
      } else {
        console.error('[DB] Hash verification FAILED for:', user.email,
          'original length:', user.passwordHash.length,
          'stored length:', storedHash.length,
          'original start:', user.passwordHash.substring(0, 10),
          'stored start:', storedHash.substring(0, 10)
        );
      }
    }

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

export async function dbDeleteUserByEmail(email: string): Promise<boolean> {
  try {
    const sql = `DELETE FROM users WHERE email = '${escapeString(email)}';`;
    await querySql(sql);
    console.log('[DB] Deleted user(s) with email:', email);
    return true;
  } catch (error) {
    console.error('[DB] Failed to delete user:', error);
    return false;
  }
}

export function isDbConfigured(): boolean {
  return !!(DB_ENDPOINT && DB_TOKEN && DB_NAMESPACE);
}
