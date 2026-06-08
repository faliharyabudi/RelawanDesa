import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Reflector } from '@nestjs/core';

@Module({
  controllers: [UsersController],
  providers: [UsersService, Reflector],
  exports: [UsersService],
})
export class UsersModule {}
