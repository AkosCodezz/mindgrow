import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(data: { id: string; email: string; name?: string | null }) {
    try {
      const existing = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT id, full_name FROM profiles WHERE id = $1::uuid`,
        data.id
      );

      if (existing && existing.length > 0) {
        return { id: data.id, email: data.email, name: existing[0].full_name };
      }

      await this.prisma.$executeRawUnsafe(
        `INSERT INTO profiles (id, full_name, updated_at)
         VALUES ($1::uuid, $2, NOW())
         ON CONFLICT (id) DO NOTHING`,
        data.id,
        data.name || null
      );

      return { id: data.id, email: data.email, name: data.name };
    } catch (e: any) {
      console.error('UsersService.findOrCreate error:', e?.message);
      return { id: data.id, email: data.email, name: data.name };
    }
  }

  async findById(id: string) {
    try {
      const result = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT id, full_name FROM profiles WHERE id = $1::uuid`,
        id
      );
      if (!result || result.length === 0) return null;
      return { id: result[0].id, name: result[0].full_name };
    } catch {
      return null;
    }
  }

  async findByEmail(email: string) {
    return null;
  }

  async update(id: string, data: any) {
    await this.prisma.$executeRawUnsafe(
      `UPDATE profiles SET full_name = $2, updated_at = NOW() WHERE id = $1::uuid`,
      id,
      data.name || null
    );
    return { id, ...data };
  }
}
