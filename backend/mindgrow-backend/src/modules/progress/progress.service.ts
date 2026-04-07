import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getUserProgress(userId: string, courseId?: string) {
    try {
      const where = courseId
        ? `WHERE user_id = $1::uuid AND course_id = '${courseId}'`
        : `WHERE user_id = $1::uuid`;
      const rows = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM user_progress ${where} ORDER BY created_at ASC`, userId
      );
      return rows || [];
    } catch (e: any) {
      console.error('ProgressService.getUserProgress error:', e?.message);
      return [];
    }
  }

  async completeLesson(userId: string, courseId: string, lessonId: string, score: number) {
    try {
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO user_progress (user_id, course_id, lesson_id, completed, score, completed_at)
         VALUES ($1::uuid, $2, $3, true, $4, NOW())
         ON CONFLICT (user_id, course_id, lesson_id)
         DO UPDATE SET completed = true, score = $4, completed_at = NOW()`,
        userId, courseId, lessonId, score
      );
      return { success: true, courseId, lessonId, score };
    } catch (e: any) {
      console.error('ProgressService.completeLesson error:', e?.message);
      return { success: false, error: e?.message };
    }
  }

  async getCourseProgress(userId: string, courseId: string, totalLessons: number) {
    try {
      const rows = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT COUNT(*) as completed FROM user_progress
         WHERE user_id = $1::uuid AND course_id = $2 AND completed = true`,
        userId, courseId
      );
      const completed = Number(rows?.[0]?.completed || 0);
      return {
        courseId,
        completed,
        total: totalLessons,
        percent: totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0,
      };
    } catch (e: any) {
      console.error('ProgressService.getCourseProgress error:', e?.message);
      return { courseId, completed: 0, total: totalLessons, percent: 0 };
    }
  }
}
