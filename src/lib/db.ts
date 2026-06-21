import type { BaziReport } from './bazi';
import { generateBaziReport } from './bazi';
import { prisma } from './prisma';
import {
  addPoints,
  getPointsHistory as fetchPointsHistory,
} from './loyalty-db';
import type { Tier, PointsLog, AddPointsResult } from './loyalty';
import type { User as PrismaUser } from '@prisma/client';

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

const adminPointsLogs: AdminPointsLog[] = [];

function parseBaziReport(raw: string | null, birthDate: string, birthHour: string | null, gender: string): BaziReport {
  if (raw) {
    return JSON.parse(raw) as BaziReport;
  }
  return generateBaziReport(birthDate, birthHour ?? undefined, gender as Gender);
}

function mapUser(row: PrismaUser): User {
  return {
    id: row.id,
    surname: row.surname,
    givenName: row.givenName,
    fullName: row.fullName,
    gender: row.gender as Gender,
    birthDate: row.birthDate,
    birthHour: row.birthHour ?? undefined,
    bloodType: row.bloodType as BloodType,
    email: row.email ?? '',
    password: row.password ?? '',
    phone: row.phone ?? undefined,
    zalo: row.zalo ?? '',
    messenger: row.messenger ?? undefined,
    tiktok: row.tiktok ?? undefined,
    baziReport: parseBaziReport(row.baziReport, row.birthDate, row.birthHour, row.gender),
    locale: row.locale,
    points: row.points,
    tier: row.tier as Tier,
    tags: { vip: row.vip, blacklist: row.blacklist },
    createdAt: row.createdAt,
  };
}

export async function createUser(
  data: Omit<User, 'id' | 'fullName' | 'createdAt' | 'points' | 'tier' | 'tags'>,
): Promise<User> {
  const row = await prisma.user.create({
    data: {
      surname: data.surname,
      givenName: data.givenName,
      fullName: `${data.surname} ${data.givenName}`,
      gender: data.gender,
      birthDate: data.birthDate,
      birthHour: data.birthHour ?? null,
      bloodType: data.bloodType,
      email: data.email.trim(),
      password: data.password,
      phone: data.phone ?? null,
      zalo: data.zalo,
      messenger: data.messenger ?? null,
      tiktok: data.tiktok ?? null,
      baziReport: JSON.stringify(data.baziReport),
      locale: data.locale,
      points: 0,
      tier: 'BRONZE',
      vip: false,
      blacklist: false,
    },
  });

  return mapUser(row);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const row = await prisma.user.findUnique({ where: { id } });
  return row ? mapUser(row) : undefined;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const normalized = email.trim().toLowerCase();
  const row = await prisma.user.findFirst({
    where: { email: { equals: normalized } },
  });
  if (row) return mapUser(row);

  const all = await prisma.user.findMany({ where: { email: { not: null } } });
  const match = all.find((u) => u.email?.toLowerCase() === normalized);
  return match ? mapUser(match) : undefined;
}

export async function createSession(userId: string): Promise<string> {
  const token = `session_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
  await prisma.session.create({ data: { token, userId } });
  return token;
}

export async function getUserBySession(token: string): Promise<User | undefined> {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });
  return session?.user ? mapUser(session.user) : undefined;
}

export async function getAllUsers(): Promise<User[]> {
  const rows = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return rows.map(mapUser);
}

export async function searchUsers(query: string): Promise<User[]> {
  const q = query.trim().toLowerCase();
  if (!q) return getAllUsers();

  const rows = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return rows
    .map(mapUser)
    .filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q) ||
        u.surname.toLowerCase().includes(q) ||
        u.givenName.toLowerCase().includes(q),
    );
}

export async function updateUserTier(userId: string, tier: Tier): Promise<User | undefined> {
  try {
    const row = await prisma.user.update({ where: { id: userId }, data: { tier } });
    return mapUser(row);
  } catch {
    return undefined;
  }
}

export async function updateUserTags(userId: string, tags: Partial<UserTags>): Promise<User | undefined> {
  try {
    const row = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(tags.vip !== undefined ? { vip: tags.vip } : {}),
        ...(tags.blacklist !== undefined ? { blacklist: tags.blacklist } : {}),
      },
    });
    return mapUser(row);
  } catch {
    return undefined;
  }
}

export async function addPointsToUser(
  userId: string,
  amount: number,
  reason: string,
): Promise<AddPointsResult | null> {
  const user = await getUserById(userId);
  if (!user) return null;
  return addPoints(user, amount, reason);
}

export async function addPointsByAdmin(
  userId: string,
  amount: number,
  reason: string,
  operator: string,
): Promise<AddPointsResult | null> {
  const user = await getUserById(userId);
  if (!user) return null;

  const result = await addPoints(user, amount, reason);
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

export async function addPointsBatchByAdmin(
  userIds: string[],
  amount: number,
  reason: string,
  operator: string,
): Promise<number> {
  let count = 0;
  for (const userId of userIds) {
    if (await addPointsByAdmin(userId, amount, reason, operator)) count++;
  }
  return count;
}

export function getAdminPointsLogs(): AdminPointsLog[] {
  return [...adminPointsLogs];
}

export { fetchPointsHistory as getPointsHistory };
