import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ProgressService } from './progress.service';

@ApiTags('Progress')
@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  getUserProgress(@CurrentUser() user: any, @Query('courseId') courseId?: string) {
    return this.progressService.getUserProgress(user.id, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('complete')
  @ApiBearerAuth()
  completeLesson(
    @CurrentUser() user: any,
    @Body() body: { courseId: string; lessonId: string; score?: number },
  ) {
    return this.progressService.completeLesson(user.id, body.courseId, body.lessonId, body.score || 100);
  }

  @UseGuards(JwtAuthGuard)
  @Get('course')
  @ApiBearerAuth()
  getCourseProgress(
    @CurrentUser() user: any,
    @Query('courseId') courseId: string,
    @Query('total') total: string,
  ) {
    return this.progressService.getCourseProgress(user.id, courseId, parseInt(total) || 0);
  }
}
