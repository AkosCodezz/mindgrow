import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CoursesService } from './courses.service';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':courseId/enroll')
  @ApiBearerAuth()
  enroll(@CurrentUser() user: any, @Param('courseId') courseId: string) {
    return this.coursesService.enroll(user.id, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/enrollments')
  @ApiBearerAuth()
  getMyEnrollments(@CurrentUser() user: any) {
    return this.coursesService.getEnrollments(user.id);
  }
}