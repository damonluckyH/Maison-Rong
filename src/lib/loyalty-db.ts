import { prisma } from './prisma';
import {
  calculateTier,
  type LoyaltyUser,
  type AddPointsResult,
  type PointsLog,
  type Tier,
} from './loyalty';

const TIER_ORDER: Tier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];

function mapPointsLog(row: {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  balance: number;
  createdAt: Date;
}): PointsLog {
  return {
    id: row.id,
    userId: row.userId,
    amount: row.amount,
    reason: row.reason,
    balance: row.balance,
    createdAt: row.createdAt,
  };
}

export async function addPoints(user: LoyaltyUser, amount: number, reason: string): Promise<AddPointsResult> {
  const previousTier = user.tier;
  const newPoints = Math.max(0, user.points + amount);
  const tierInfo = calculateTier(newPoints);

  const logRow = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { points: newPoints, tier: tierInfo.tier },
    });

    return tx.pointsLog.create({
      data: {
        userId: user.id,
        amount,
        reason,
        balance: newPoints,
      },
    });
  });

  user.points = newPoints;
  user.tier = tierInfo.tier;

  const log = mapPointsLog(logRow);

  return {
    previousTier,
    newTier: tierInfo.tier,
    upgraded: TIER_ORDER.indexOf(tierInfo.tier) > TIER_ORDER.indexOf(previousTier),
    log,
  };
}

export async function getPointsHistory(userId: string): Promise<PointsLog[]> {
  const rows = await prisma.pointsLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(mapPointsLog);
}
