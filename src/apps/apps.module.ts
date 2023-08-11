import { AppsService } from './apps.service';
import { AppsController } from './apps.controller';

import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [AppsController],
  providers: [AppsService, PrismaService],
})
export class AppsModule {}
