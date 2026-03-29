import { IsString, IsEnum, IsOptional, IsArray, IsDateString } from 'class-validator';
import { Mood } from '@prisma/client';

export class CreateJournalDto {
  @IsDateString()
  date: string;

  @IsString()
  content: string;

  @IsEnum(Mood)
  mood?: Mood;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
