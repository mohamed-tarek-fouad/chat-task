import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';

import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [ChatsController],
  providers: [ChatsService, PrismaService],
})
export class ChatsModule {}
