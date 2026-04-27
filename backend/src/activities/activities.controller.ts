import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  // Admin: buat kegiatan baru
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateActivityDto) {
    return this.activitiesService.create(dto);
  }

  // Semua (user & admin): lihat semua kegiatan
  @Get()
  findAll() {
    return this.activitiesService.findAll();
  }

  // Semua: lihat detail satu kegiatan
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(id);
  }

  // Admin: edit kegiatan
  @Roles(Role.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateActivityDto) {
    return this.activitiesService.update(id, dto);
  }

  // Admin: hapus kegiatan
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(id);
  }

  // User: daftar sebagai relawan
  @Post(':id/join')
  join(
    @Param('id') activityId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.activitiesService.joinActivity(activityId, userId);
  }

  // Admin: lihat daftar relawan pada kegiatan
  @Roles(Role.ADMIN)
  @Get(':id/volunteers')
  getVolunteers(@Param('id') id: string) {
    return this.activitiesService.getVolunteers(id);
  }
}
