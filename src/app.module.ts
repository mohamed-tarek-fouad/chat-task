import { MessagesModule } from './messages/messages.module';
import { ChatsModule } from './chats/chats.module';
import { AppsModule } from './apps/apps.module';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import * as CacheStore from 'cache-manager-ioredis';
@Module({
  imports: [
    MessagesModule,
    ChatsModule,
    AppsModule,
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: CacheStore,
      host: 'localhost',
      port: process.env.REDIS,
      ttl: 60 * 60 * 6,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
