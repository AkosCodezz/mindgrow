import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { JournalsModule } from './modules/journals/journals.module';
import { GoalsModule } from './modules/goals/goals.module';
import { HabitsModule } from './modules/habits/habits.module';
import { CoursesModule } from './modules/courses/courses.module';
import { StatsModule } from './modules/stats/stats.module';
import { ProgressModule } from './modules/progress/progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 100 }]),
    AuthModule,
    UsersModule,
    JournalsModule,
    GoalsModule,
    HabitsModule,
    CoursesModule,
    StatsModule,
    ProgressModule,
  ],
})
export class AppModule {}
