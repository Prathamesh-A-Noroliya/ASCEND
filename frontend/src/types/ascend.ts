export type QuestStatus = 'ACTIVE' | 'STARTED' | 'COMPLETED';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC';
export type Category = 'CODING' | 'STUDY' | 'FITNESS' | 'MINDFULNESS' | 'CREATIVE' | 'SOCIAL';
export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'MYTHIC';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  rewards: { xp: number; gold: number };
  status: QuestStatus;
  createdAt: string;
  completedAt?: string;
}
export interface Character {
  id: string;
  name: string;
  title: string;
  level: number;
  xp: number;
  xpToNext: number;
  gold: number;
  streak: number;
  longestStreak: number;
  attributes: { strength: number; intellect: number; discipline: number; creativity: number; charisma: number };
  worldProgress: number;
}
export interface ShopItem {
  id: string; name: string; description: string; rarity: Rarity; price: number; slot: string; icon: string;
}
export interface InventoryItem extends ShopItem { equipped: boolean; }
export interface Activity { id: string; label: string; meta: string; time: string; tone: 'gold' | 'green' | 'blue'; }
export interface User { id: string; name: string; email: string; avatar: string; }