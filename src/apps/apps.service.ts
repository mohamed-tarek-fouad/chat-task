import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AppDto } from './dtos/createApp.dto';
import { v4 } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class AppsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async createApp(appBody: AppDto) {
    try {
      const token = v4();
      const app = await this.prisma.apps.create({
        data: { ...appBody, token: String(token) },
        select: { name: true, token: true },
      });
      await this.cacheManager.del('apps');
      return { message: 'app created successfully', app };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async updateApp(appBody: AppDto, token: string) {
    try {
      const app = await this.prisma.apps.update({
        where: { token },
        data: appBody,
        select: { token: true, name: true },
      });
      await this.cacheManager.del('apps');
      await this.cacheManager.del(`app${token}`);
      return { message: 'app updated successfully', app };
    } catch (error) {
      throw new HttpException(
        'somthing wrong happened',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async allApps() {
    try {
      const isCached: object = await this.cacheManager.get('apps');
      if (isCached) {
        return {
          apps: isCached,
          message: 'fetched all apps successfully',
        };
      }
      const apps = await this.prisma.apps.findMany({
        select: { name: true, token: true },
      });
      return { message: 'retrieved all apps successfully', apps };
    } catch (error) {
      throw new HttpException(
        'somthing wrong happened',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async appByToken(token: string) {
    try {
      const isCached: object = await this.cacheManager.get(`app${token}`);
      if (isCached) {
        return {
          apps: isCached,
          message: 'fetched app successfully',
        };
      }
      const app = await this.prisma.apps.findUnique({
        where: { token },
        select: { token: true, name: true },
      });
      return { message: 'app found successfully', app };
    } catch (error) {
      throw new HttpException(
        'somthing wrong happened',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
