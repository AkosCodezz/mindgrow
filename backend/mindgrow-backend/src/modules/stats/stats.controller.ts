import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  getStats(@CurrentUser() user: any) {
    return this.statsService.getStats(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('xp')
  @ApiBearerAuth()
  addXp(@CurrentUser() user: any, @Body() body: { amount: number; source: string; description?: string }) {
    return this.statsService.addXp(user.id, body.amount, body.source, body.description);
  }

  @UseGuards(JwtAuthGuard)
  @Post('streak')
  @ApiBearerAuth()
  updateStreak(@CurrentUser() user: any) {
    return this.statsService.updateStreak(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('challenge-complete')
  @ApiBearerAuth()
  completeChallenge(@CurrentUser() user: any) {
    return this.statsService.incrementChallenges(user.id);
  }

  @Get('leaderboard')
  getLeaderboard(@Query('limit') limit?: string) {
    return this.statsService.getLeaderboard(limit ? parseInt(limit) : 10);
  }

  @UseGuards(JwtAuthGuard)
  @Get('xp-history')
  @ApiBearerAuth()
  getXpHistory(@CurrentUser() user: any, @Query('limit') limit?: string) {
    return this.statsService.getXpHistory(user.id, limit ? parseInt(limit) : 20);
  }
}
