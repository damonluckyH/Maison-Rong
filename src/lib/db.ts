import type { BaziReport } from './bazi';
import { generateBaziReport } from './bazi';
import {
  addPoints as applyPoints,
  getPointsHistory,
  type Tier,
  type PointsLog,
  type AddPointsResult,
} from './loyalty';

export type { Tier, PointsLog, AddPointsResult };
export type Gender = 'MALE' | 'FEMALE';
export type BloodType = 'A' | 'B' | 'AB' | 'O';

export interface UserTags {
  vip: boolean;
  blacklist: boolean;
}

export interface User {
  id: string;
  surname: string;
  givenName: string;
  fullName: string;
  gender: Gender;
  birthDate: string;
  birthHour?: string;
  bloodType: BloodType;
  email: string;
  password: string;
  phone?: string;
  zalo: string;
  messenger?: string;
  tiktok?: string;
  baziReport: BaziReport;
  locale: string;
  points: number;
  tier: Tier;
  tags: UserTags;
  createdAt: Date;
}

export interface AdminPointsLog {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  reason: string;
  operator: string;
  createdAt: Date;
}

const users = new Map<string, User>();
const sessions = new Map<string, string>();
const adminPointsLogs: AdminPointsLog[] = [];

function seedMockUsers() {
  if (users.size > 0) return;

  const seeds: Omit<User, 'fullName' | 'createdAt' | 'baziReport'>[] = [
    {
      id: 'seed_user_1',
      surname: 'Nguyễn',
      givenName: 'Minh Anh',
      gender: 'FEMALE',
      birthDate: '1990-03-15',
      bloodType: 'A',
      email: 'minhanh@email.vn',
      password: 'demo1234',
      phone: '0901234567',
      zalo: '0901234567',
      locale: 'vi',
      points: 850,
      tier: 'BRONZE',
      tags: { vip: false, blacklist: false },
    },
    {
      id: 'seed_user_2',
      surname: 'Trần',
      givenName: 'Thu Hà',
      gender: 'FEMALE',
      birthDate: '1988-07-22',
      bloodType: 'B',
      email: 'thuha@email.vn',
      password: 'demo1234',
      phone: '0912345678',
      zalo: '0912345678',
      messenger: 'thuha.fb',
      locale: 'vi',
      points: 3200,
      tier: 'SILVER',
      tags: { vip: true, blacklist: false },
    },
    {
      id: 'seed_user_3',
      surname: 'Lê',
      givenName: 'Văn Đức',
      gender: 'MALE',
      birthDate: '1985-11-08',
      bloodType: 'O',
      email: 'vanduc@email.vn',
      password: 'demo1234',
      zalo: '0987654321',
      locale: 'vi',
      points: 12500,
      tier: 'GOLD',
      tags: { vip: true, blacklist: false },
    },
    {
      id: 'seed_user_4',
      surname: 'Phạm',
      givenName: 'Quốc Bảo',
      gender: 'MALE',
      birthDate: '1992-01-30',
      bloodType: 'AB',
      email: 'quocbao@email.vn',
      password: 'demo1234',
      phone: '0923456789',
      zalo: '0923456789',
      locale: 'vi',
      points: 450,
      tier: 'BRONZE',
      tags: { vip: false, blacklist: true },
    },
    {
      id: 'seed_user_5',
      surname: 'Hoàng',
      givenName: 'Thị Lan',
      gender: 'FEMALE',
      birthDate: '1978-09-12',
      bloodType: 'A',
      email: 'thilan@email.vn',
      password: 'demo1234',
      zalo: '0977889900',
      tiktok: '@thilan_lux',
      locale: 'vi',
      points: 28000,
      tier: 'PLATINUM',
      tags: { vip: true, blacklist: false },
    },
    {
      id: 'seed_user_6',
      surname: 'Võ',
      givenName: 'Đình Khang',
      gender: 'MALE',
      birthDate: '1995-05-05',
      bloodType: 'B',
      email: 'dinhkhang@email.vn',
      password: 'demo1234',
      phone: '0934567890',
      zalo: '0934567890',
      messenger: 'dinhkhang.messenger',
      locale: 'vi',
      points: 62000,
      tier: 'DIAMOND',
      tags: { vip: true, blacklist: false },
    },
  ];

  for (const seed of seeds) {
    const user: User = {
      ...seed,
      fullName: `${seed.surname} ${seed.givenName}`,
      baziReport: generateBaziReport(seed.birthDate, seed.birthHour, seed.gender),
      createdAt: new Date('2026-01-01'),
    };
    users.set(user.id, user);
  }
}

seedMockUsers();

export function createUser(data: Omit<User, 'id' | 'fullName' | 'createdAt' | 'points' | 'tier' | 'tags'>): User {
  const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const user: User = {
    ...data,
    id,
    fullName: `${data.surname} ${data.givenName}`,
    points: 0,
    tier: 'BRONZE',
    tags: { vip: false, blacklist: false },
    createdAt: new Date(),
  };
  users.set(id, user);
  return user;
}

export function getUserById(id: string): User | undefined {
  return users.get(id);
}

export function getUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase();
  return Array.from(users.values()).find((u) => u.email.toLowerCase() === normalized);
}

export function createSession(userId: string): string {
  const token = `session_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
  sessions.set(token, userId);
  return token;
}

export function getUserBySession(token: string): User | undefined {
  const userId = sessions.get(token);
  if (!userId) return undefined;
  return users.get(userId);
}

export function getAllUsers(): User[] {
  return Array.from(users.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function searchUsers(query: string): User[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllUsers();
  return getAllUsers().filter(
    (u) =>
      u.fullName.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q) ||
      u.surname.toLowerCase().includes(q) ||
      u.givenName.toLowerCase().includes(q),
  );
}

export function updateUserTier(userId: string, tier: Tier): User | undefined {
  const user = users.get(userId);
  if (!user) return undefined;
  user.tier = tier;
  return user;
}

export function updateUserTags(userId: string, tags: Partial<UserTags>): User | undefined {
  const user = users.get(userId);
  if (!user) return undefined;
  user.tags = { ...user.tags, ...tags };
  return user;
}

export function addPointsToUser(userId: string, amount: number, reason: string): AddPointsResult | null {
  const user = users.get(userId);
  if (!user) return null;
  return applyPoints(user, amount, reason);
}

export function addPointsByAdmin(
  userId: string,
  amount: number,
  reason: string,
  operator: string,
): AddPointsResult | null {
  const user = users.get(userId);
  if (!user) return null;

  const result = applyPoints(user, amount, reason);
  adminPointsLogs.unshift({
    id: `alog_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId: user.id,
    userName: user.fullName,
    amount,
    reason,
    operator,
    createdAt: new Date(),
  });

  return result;
}

export function addPointsBatchByAdmin(
  userIds: string[],
  amount: number,
  reason: string,
  operator: string,
): number {
  let count = 0;
  for (const userId of userIds) {
    if (addPointsByAdmin(userId, amount, reason, operator)) count++;
  }
  return count;
}

export function getAdminPointsLogs(): AdminPointsLog[] {
  return [...adminPointsLogs];
}

export { getPointsHistory };
