import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    try {
      const rows = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM user_stats WHERE user_id = $1::uuid`, userId
      );
      if (!rows || rows.length === 0) {
        await this.prisma.$executeRawUnsafe(
          `INSERT INTO user_stats (user_id) VALUES ($1::uuid) ON CONFLICT (user_id) DO NOTHING`, userId
        );
        return { coins: 0, xp: 0, level: 1, streak: 0, bestStreak: 0, challengesSolved: 0, rank: 'Bronze', lastActive: null };
      }
      const s = rows[0];
      return {
        coins: s.coins || 0, xp: s.xp || 0, level: s.level || 1,
        streak: s.streak || 0, bestStreak: s.best_streak || 0,
        challengesSolved: s.challenges_solved || 0,
        rank: s.rank || 'Bronze', lastActive: s.last_active,
      };
    } catch (e: any) {
      console.error('StatsService.getStats error:', e?.message);
      return { coins: 0, xp: 0, level: 1, streak: 0, bestStreak: 0, challengesSolved: 0, rank: 'Bronze', lastActive: null };
    }
  }

  async addXp(userId: string, amount: number, source: string, description?: string) {
    try {
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO xp_log (user_id, amount, source, description) VALUES ($1::uuid, $2, $3, $4)`,
        userId, amount, source, description || null
      );
      const coinsEarned = Math.floor(amount / 10);
      await this.prisma.$executeRawUnsafe(
        `UPDATE user_stats SET 
          xp = xp + $2, coins = coins + $3,
          level = GREATEST(1, FLOOR((xp + $2)::numeric / 500) + 1)::int,
          rank = CASE
            WHEN FLOOR((xp + $2)::numeric / 500) + 1 >= 20 THEN 'Diamond'
            WHEN FLOOR((xp + $2)::numeric / 500) + 1 >= 15 THEN 'Platinum'
            WHEN FLOOR((xp + $2)::numeric / 500) + 1 >= 10 THEN 'Gold'
            WHEN FLOOR((xp + $2)::numeric / 500) + 1 >= 5 THEN 'Silver'
            ELSE 'Bronze'
          END, updated_at = NOW()
        WHERE user_id = $1::uuid`,
        userId, amount, coinsEarned
      );
    } catch (e: any) {
      console.error('StatsService.addXp error:', e?.message);
    }
    return this.getStats(userId);
  }

  async updateStreak(userId: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      await this.prisma.$executeRawUnsafe(
        `UPDATE user_stats SET
          streak = CASE
            WHEN last_active = ($2::date - INTERVAL '1 day')::date THEN streak + 1
            WHEN last_active = $2::date THEN streak
            ELSE 1
          END,
          best_streak = GREATEST(best_streak, CASE
            WHEN last_active = ($2::date - INTERVAL '1 day')::date THEN streak + 1
            ELSE 1
          END),
          last_active = $2::date, updated_at = NOW()
        WHERE user_id = $1::uuid`,
        userId, today
      );
    } catch (e: any) {
      console.error('StatsService.updateStreak error:', e?.message);
    }
    return this.getStats(userId);
  }

  async incrementChallenges(userId: string) {
    try {
      await this.prisma.$executeRawUnsafe(
        `UPDATE user_stats SET challenges_solved = challenges_solved + 1, updated_at = NOW() WHERE user_id = $1::uuid`,
        userId
      );
    } catch (e: any) {
      console.error('StatsService.incrementChallenges error:', e?.message);
    }
    return this.getStats(userId);
  }

  async getLeaderboard(limit = 10) {
    try {
      const rows = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT us.user_id, us.xp, us.level, us.streak, us.challenges_solved, us.rank, us.coins,
                p.full_name
         FROM user_stats us
         LEFT JOIN profiles p ON p.id = us.user_id
         ORDER BY us.xp DESC
         LIMIT ${Number(limit)}`
      );
      return (rows || []).map((r: any, i: number) => ({
        rank: i + 1, userId: r.user_id, name: r.full_name || 'Anonymous',
        xp: r.xp || 0, level: r.level || 1, streak: r.streak || 0,
        challengesSolved: r.challenges_solved || 0, userRank: r.rank || 'Bronze', coins: r.coins || 0,
      }));
    } catch (e: any) {
      console.error('StatsService.getLeaderboard error:', e?.message);
      return [];
    }
  }

  async getXpHistory(userId: string, limit = 20) {
    try {
      const rows = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM xp_log WHERE user_id = $1::uuid ORDER BY created_at DESC LIMIT ${Number(limit)}`,
        userId
      );
      return rows || [];
    } catch (e: any) {
      console.error('StatsService.getXpHistory error:', e?.message);
      return [];
    }
  }
}
