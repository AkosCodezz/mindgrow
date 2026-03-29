import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';

@Injectable()
export class HabitsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateHabitDto) {
    return this.prisma.habit.create({
      data: { ...dto, userId },
    });
  }

  findAll(userId: string) {
    return this.prisma.habit.findMany({ where: { userId } });
  }

  findOne(id: string, userId: string) {
    return this.prisma.habit.findFirst({ where: { id, userId } });
  }

  update(id: string, userId: string, dto: any) {
    return this.prisma.habit.update({ where: { id }, data: dto });
  }

  remove(id: string, userId: string) {
    return this.prisma.habit.delete({ where: { id } });
  }
}