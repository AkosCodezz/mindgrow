import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJournalDto } from './dto/create-journal.dto';

@Injectable()
export class JournalsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateJournalDto) {
    return this.prisma.journal.create({
      data: { ...dto, userId },
    });
  }

  findAll(userId: string) {
    return this.prisma.journal.findMany({ where: { userId }, orderBy: { date: 'desc' } });
  }

  findOne(id: string, userId: string) {
    return this.prisma.journal.findFirst({ where: { id, userId } });
  }

  update(id: string, userId: string, dto: any) {
    return this.prisma.journal.update({ where: { id }, data: dto });
  }

  remove(id: string, userId: string) {
    return this.prisma.journal.delete({ where: { id } });
  }
}
