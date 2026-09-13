import type { Character, Quest, User } from '@/types/ascend';

const base = ((import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api').replace(/\/$/, '');
let connected = false;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!base) throw new Error('API not configured');

  const token = localStorage.getItem('ascend_token');

  const response = await fetch(`${base}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    connected = false;
    throw new Error(`API ${response.status}`);
  }

  connected = true;
  return response.json();
}

export const getConnectionStatus = () => connected;

export async function getCharacter() {
  const data = await request<{ character: any }>('/character');
  return mapCharacter(data.character);
}

export async function getQuests() {
  const data = await request<{ quests: any[] }>('/quests');
  return data.quests.map(mapQuest);
}

export async function createQuest(data: any) {
  const response = await request<{ quest: any }>('/quests', {
    method: 'POST',
    body: JSON.stringify({
      title: data.title,
      description: data.description || '',
      category: String(data.category).toLowerCase(),
      difficulty: String(data.difficulty || 'easy').toLowerCase(),
    }),
  });

  return mapQuest(response.quest);
}

export async function completeQuest(id: string) {
  const data = await request<any>(`/quests/${id}/complete`, {
    method: 'POST',
  });

  return {
    ...mapQuest(data.quest || {}),
    rewards: data.rewards,
    character: data.character,
    level: data.level,
  };
}

export async function login(data: { email: string; password: string }) {
  const response = await request<{ user: any; token?: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (response.token) {
    localStorage.setItem('ascend_token', response.token);
  }

  return mapUser(response.user);
}

export async function signup(data: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await request<{ user: any; token?: string }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (response.token) {
    localStorage.setItem('ascend_token', response.token);
  }

  return mapUser(response.user);
}

export async function getCurrentUser() {
  return null;
}

export async function logout() {
  localStorage.removeItem('ascend_token');
}

function mapUser(user: any): User {
  return {
    id: String(user._id || user.id),
    name: user.username || user.name || 'Operative',
    email: user.email,
    avatar: (user.username || user.name || 'OP')
      .slice(0, 2)
      .toUpperCase(),
  };
}

function mapCharacter(c: any): Character {
  return {
    id: String(c._id || c.id),
    name: 'Mara Voss',
    title: 'Initiate of the First Light',
    level: c.level || 1,
    xp: c.xp || 0,
    xpToNext: Math.round(100 * Math.pow(1.18, (c.level || 1) - 1)),
    gold: c.gold || 0,
    streak: c.currentStreak || 0,
    longestStreak: c.longestStreak || 0,
    attributes: {
      strength: c.strength || 1,
      intellect: c.intellect || 1,
      discipline: c.discipline || 1,
      creativity: c.creativity || 1,
      charisma: c.charisma || 1,
    },
    worldProgress: Math.min(100, (c.level || 1) * 3),
  };
}

function mapQuest(q: any): Quest {
  return {
    id: String(q._id || q.id),
    title: q.title,
    description: q.description || '',
    category: String(q.category || 'study').toUpperCase() as any,
    difficulty: String(q.difficulty || 'easy').toUpperCase() as any,
    rewards: {
      xp: q.xpReward || 0,
      gold: q.goldReward || 0,
    },
    status:
      q.status === 'completed'
        ? 'COMPLETED'
        : q.status === 'started'
          ? 'STARTED'
          : 'ACTIVE',
    createdAt: q.createdAt
      ? new Date(q.createdAt).toLocaleDateString()
      : 'Today',
    completedAt: q.completedAt
      ? new Date(q.completedAt).toLocaleDateString()
      : undefined,
  };
}

export async function startQuest(id: string) {
  const data = await request<any>(`/quests/${id}/start`, {
    method: 'POST',
  });

  return mapQuest(data.quest);
}

export async function updateQuest(id: string, data: any) {
  if (data?.status === 'STARTED') {
    return startQuest(id);
  }

  const response = await request<any>(`/quests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

  return mapQuest(response.quest);
}

export async function deleteQuest(id: string) {
  await request<any>(`/quests/${id}`, {
    method: 'DELETE',
  });

  return true;
}

export async function getShop() {
  return [];
}

export async function getInventory() {
  return [];
}

export async function purchaseItem(id: string) {
  throw new Error('Shop is not available in this version.');
}

export async function equipItem(id: string) {
  throw new Error('Inventory is not available in this version.');
}

export async function unequipItem(id: string) {
  throw new Error('Inventory is not available in this version.');
}
