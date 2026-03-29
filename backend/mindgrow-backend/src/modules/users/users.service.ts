import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find user profile by Supabase UUID, or create if first API call.
   * Uses the existing Supabase 'profiles' table.
   */
  async findOrCreate(data: { id: string; email: string; name?: string | null }) {
    // Check if profile exists in Supabase profiles table
    const existing = await this.prisma.$queryRaw<any[]>`
      SELECT id, full_name FROM profiles WHERE id = ${data.id}::uuid
    `;

    if (existing && existing.length > 0) {
      return { id: data.id, email: data.email, name: existing[0].full_name };
    }

    // Create profile if it doesn't exist
    await this.prisma.$executeRaw`
      INSERT INTO profiles (id, full_name, updated_at)
      VALUES (${data.id}::uuid, ${data.name || null}, NOW())
      ON CONFLICT (id) DO NOTHING
    `;

    return { id: data.id, email: data.email, name: data.name };
  }

  async findById(id: string) {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT id, full_name FROM profiles WHERE id = ${id}::uuid
    `;
    if (!result || result.length === 0) return null;
    return { id: result[0].id, name: result[0].full_name };
  }

  async findByEmail(email: string) {
    // Email is stored in auth.users, not profiles - not accessible via Prisma
    return null;
  }

  async update(id: string, data: any) {
    await this.prisma.$executeRaw`
      UPDATE profiles SET full_name = ${data.name || null}, updated_at = NOW()
      WHERE id = ${id}::uuid
    `;
    return { id, ...data };
  }
}
