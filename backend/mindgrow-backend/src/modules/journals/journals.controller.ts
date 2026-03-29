import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JournalsService } from './journals.service';
import { CreateJournalDto } from './dto/create-journal.dto';

@ApiTags('Journals')
@Controller('journals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class JournalsController {
  constructor(private journalsService: JournalsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateJournalDto) {
    return this.journalsService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.journalsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.journalsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: any) {
    return this.journalsService.update(id, user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.journalsService.remove(id, user.id);
  }
}