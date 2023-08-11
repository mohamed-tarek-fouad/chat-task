import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MessageDto } from './dtos/message.dto';
import { SearshDto } from './dtos/searsh.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async newMessage(messageBody: MessageDto, number: string, appToken: string) {
    try {
      const lastNumber = await this.prisma.chats.findMany({
        where: { appId: appToken },
        orderBy: { number: 'desc' },
      });
      const biggestMessageNumber = lastNumber?.reduce((prev, curr) => {
        return Math.max(prev, curr.number);
      }, 0);
      const message = await this.prisma.messages.create({
        data: {
          ...messageBody,
          chatId: number + appToken,
          number: biggestMessageNumber ? biggestMessageNumber + 1 : 1,
        },
        select: { message: true, number: true },
      });
      await this.cacheManager.del(`messages${number}${appToken}`);
      return { message: 'new message successfully', messageSent: message };
    } catch (error) {
      throw new HttpException(
        'somthing wrong happened',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async updateMessage(
    messageBody: MessageDto,
    number: string,
    appToken: string,
  ) {
    try {
      await this.prisma.messages.updateMany({
        where: { chatId: number + appToken },
        data: messageBody,
      });
      await this.cacheManager.del(`messages${number}${appToken}`);
      return { message: 'message updated successfully' };
    } catch (error) {
      throw new HttpException(
        'somthing wrong happened',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async allMessages(number: string, appToken: string) {
    try {
      const isCached: object = await this.cacheManager.get(
        `chat${appToken}${number}`,
      );
      if (isCached) {
        return {
          apps: isCached,
          message: 'fetched chat successfully',
        };
      }
      const messages = await this.prisma.messages.findMany({
        where: { chatId: number + appToken },
        select: { message: true, number: true, chatId: true },
      });
      return { message: 'all messages successfully', messages };
    } catch (error) {
      throw new HttpException(
        'somthing wrong happened',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async searsh(searshString: SearshDto, number: string, appToken: string) {
    try {
      const isCached: object = await this.cacheManager.get(
        `chat${appToken}${number}${searshString}`,
      );
      if (isCached) {
        return {
          apps: isCached,
          message: 'fetched chat successfully',
        };
      }
      const result = await this.prisma.messages.findMany({
        where: {
          chatId: number + appToken,
          message: { contains: searshString.searshString },
        },
      });
      return { message: 'results are', result };
    } catch (error) {
      throw new HttpException(
        'somthing wrong happened',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
