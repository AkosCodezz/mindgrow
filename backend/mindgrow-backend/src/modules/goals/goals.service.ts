import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateGoalDto) {
    return this.prisma.goal.create({
      data: { ...dto, userId },
    });
  }

  findAll(userId: string) {
    return this.prisma.goal.findMany({ where: { userId } });
  }

  findOne(id: string, userId: string) {
    return this.prisma.goal.findFirst({ where: { id, userId } });
  }

  update(id: string, userId: string, dto: any) {
    return this.prisma.goal.update({ where: { id }, data: dto });
  }

  remove(id: string, userId: string) {
    return this.prisma.goal.delete({ where: { id } });
  }
}