import { IsString, IsOptional } from 'class-validator';

export class CreateHabitDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}