import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { volunteers: true } },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        volunteers: {
          include: { activity: true },
        },
      },
    });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    const data: Partial<UpdateUserDto & { password: string }> = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.prisma.user.update({ where: { id }, data });
    const { password: _, ...result } = updated;
    return result;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User berhasil dihapus' };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { volunteers: true } },
      },
    });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  async getMyActivities(userId: string) {
    return this.prisma.volunteerActivity.findMany({
      where: { userId },
      include: { activity: true },
      orderBy: { joinedAt: 'desc' },
    });
  }

  async unjoinActivity(userId: string, activityId: string) {
    const record = await this.prisma.volunteerActivity.findUnique({
      where: { userId_activityId: { userId, activityId } },
    });
    if (!record) throw new NotFoundException('Anda belum terdaftar di kegiatan ini');
    await this.prisma.volunteerActivity.delete({
      where: { userId_activityId: { userId, activityId } },
    });
    return { message: 'Berhasil keluar dari kegiatan' };
  }
}
