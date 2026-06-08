import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateActivityDto) {
    return this.prisma.activity.create({
      data: {
        ...dto,
        date: new Date(dto.date),
      },
    });
  }

  async findAll() {
    return this.prisma.activity.findMany({
      orderBy: { date: 'asc' },
      include: {
        _count: { select: { volunteers: true } },
      },
    });
  }

  async findOne(id: string) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: {
        _count: { select: { volunteers: true } },
        volunteers: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true }
            }
          }
        }
      },
    });
    if (!activity) throw new NotFoundException('Kegiatan tidak ditemukan');
    return activity;
  }

  async update(id: string, dto: UpdateActivityDto) {
    await this.findOne(id);
    return this.prisma.activity.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.date && { date: new Date(dto.date) }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.activity.delete({ where: { id } });
    return { message: 'Kegiatan berhasil dihapus' };
  }

  // Relawan mendaftar ke kegiatan
  async joinActivity(activityId: string, userId: string) {
    await this.findOne(activityId);

    const alreadyJoined = await this.prisma.volunteerActivity.findUnique({
      where: { userId_activityId: { userId, activityId } },
    });
    if (alreadyJoined) {
      throw new ConflictException('Anda sudah terdaftar di kegiatan ini');
    }

    return this.prisma.volunteerActivity.create({
      data: { userId, activityId },
      include: { activity: true },
    });
  }

  // Ambil daftar relawan pada suatu kegiatan (Admin)
  async getVolunteers(activityId: string) {
    await this.findOne(activityId);
    return this.prisma.volunteerActivity.findMany({
      where: { activityId },
      include: {
        user: {
          select: { id: true, name: true, email: true, createdAt: true },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });
  }
}
