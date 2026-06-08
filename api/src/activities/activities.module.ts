import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { Reflector } from '@nestjs/core';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService, Reflector],
})
export class ActivitiesModule {}
