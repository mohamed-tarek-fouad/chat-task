import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class ChatsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async newChat(appToken: string) {
    try {
      const lastNumber = await this.prisma.chats.findMany({
        where: { appId: appToken },
        orderBy: { number: 'desc' },
      });
      const biggestChatNumber = lastNumber?.reduce((prev, curr) => {
        return Math.max(prev, curr.number);
      }, 0);
      const chat = await this.prisma.chats.create({
        data: {
          appId: appToken,
          number: biggestChatNumber ? biggestChatNumber + 1 : 1,
          numberWithId: biggestChatNumber
            ? biggestChatNumber + 1 + appToken
            : 1 + appToken,
        },
        select: { appId: true, number: true },
      });
      await this.cacheManager.del('chats');
      return { message: 'created new chat successfully', chat };
    } catch (error) {
      throw new HttpException(
        'somthing wrong happened',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async chatsByToken(appToken: string) {
    try {
      const isCached: object = await this.cacheManager.get(`chat${appToken}`);
      if (isCached) {
        return {
          apps: isCached,
          message: 'fetched chat successfully',
        };
      }
      const chats = await this.prisma.chats.findMany({
        where: { appId: appToken },
        select: { appId: true, number: true },
      });
      return { message: 'all chats for this app', chats };
    } catch (error) {
      throw new HttpException(
        'somthing wrong happened',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async singleChat(number: string, appToken: string) {
    try {
      const isCached: object = await this.cacheManager.get(
        `chat${number}${appToken}`,
      );
      if (isCached) {
        return {
          apps: isCached,
          message: 'fetched app successfully',
        };
      }
      const chat = await this.prisma.chats.findFirst({
        where: { number: parseInt(number), appId: appToken },
        select: { appId: true, number: true },
      });
      return { message: 'returned chat successfully', chat };
    } catch (error) {
      throw new HttpException(
        'somthing wrong happened',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
