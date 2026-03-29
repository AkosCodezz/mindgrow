import { Module } from '@nestjs/common';
import { JournalsController } from './journals.controller';
import { JournalsService } from './journals.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [JournalsController],
  providers: [JournalsService, PrismaService],
})
export class JournalsModule {}