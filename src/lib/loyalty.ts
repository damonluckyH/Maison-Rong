import { prisma } from './prisma';

export type Tier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';

export interface TierInfo {
  tier: Tier;
  nameVi: string;
  minPoints: number;
  privileges: string[];
  color: string;
  icon: string;
}

export interface PointsLog {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  balance: number;
  createdAt: Date;
}

export interface LoyaltyUser {
  id: string;
  points: number;
  tier: Tier;
}

export interface AddPointsResult {
  previousTier: Tier;
  newTier: Tier;
  upgraded: boolean;
  log: PointsLog;
}

export const POINTS_RULES = {
  register: 100,
  purchase: 1,
  birthday: 200,
  invite: 500,
  inviteOrder: 1000,
  review: 50,
  share: 20,
  shareDailyCap: 100,
} as const;

export const TIER_DEFINITIONS: TierInfo[] = [
  {
    tier: 'BRONZE',
    nameVi: 'Đồng',
    minPoints: 0,
    color: '#CD7F32',
    icon: '🥉',
    privileges: ['privilegeStandardPrice', 'privilegeBaziChart'],
  },
  {
    tier: 'SILVER',
    nameVi: 'Bạc',
    minPoints: 1000,
    color: '#C0C0C0',
    icon: '🥈',
    privileges: ['privilegeBirthdayGift', 'privilegeEarlyAccess'],
  },
  {
    tier: 'GOLD',
    nameVi: 'Vàng',
    minPoints: 5000,
    color: '#D4A843',
    icon: '🥇',
    privileges: ['privilegeDedicatedSupport', 'privilegeFreeEngraving', 'privilegeVipEvents'],
  },
  {
    tier: 'PLATINUM',
    nameVi: 'Bạch Kim',
    minPoints: 20000,
    color: '#E5E4E2',
    icon: '💎',
    privileges: ['privilegePersonalConsultation', 'privilegeFreeShipping', 'privilegeLimitedReserve'],
  },
  {
    tier: 'DIAMOND',
    nameVi: 'Kim Cương',
    minPoints: 50000,
    color: '#B9F2FF',
    icon: '👑',
    privileges: ['privilegeAnnualFamilyCustom', 'privilegeMasterAppointment', 'privilegeBrandGala'],
  },
];

export const ALL_PRIVILEGES: { key: string; minTier: Tier }[] = TIER_DEFINITIONS.flatMap((def) =>
  def.privileges.map((key) => ({ key, minTier: def.tier })),
);

const TIER_ORDER: Tier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];

export function calculateTier(points: number): TierInfo {
  let current = TIER_DEFINITIONS[0];
  for (const def of TIER_DEFINITIONS) {
    if (points >= def.minPoints) {
      current = def;
    }
  }
  return current;
}

export function getNextTier(points: number): TierInfo | null {
  const current = calculateTier(points);
  const idx = TIER_DEFINITIONS.findIndex((t) => t.tier === current.tier);
  if (idx < 0 || idx >= TIER_DEFINITIONS.length - 1) return null;
  return TIER_DEFINITIONS[idx + 1];
}

export function getPointsToNext(points: number): number {
  const next = getNextTier(points);
  if (!next) return 0;
  return Math.max(0, next.minPoints - points);
}

export function getTierProgress(points: number): number {
  const current = calculateTier(points);
  const next = getNextTier(points);
  if (!next) return 100;
  const range = next.minPoints - current.minPoints;
  if (range <= 0) return 100;
  return Math.min(100, Math.max(0, ((points - current.minPoints) / range) * 100));
}

export function isPrivilegeUnlocked(userTier: Tier, privilegeMinTier: Tier): boolean {
  return TIER_ORDER.indexOf(userTier) >= TIER_ORDER.indexOf(privilegeMinTier);
}
