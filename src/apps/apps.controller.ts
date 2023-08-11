import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppsService } from './apps.service';
import { AppDto } from './dtos/createApp.dto';

@Controller('apps')
export class AppsController {
  constructor(private readonly appsServices: AppsService) {}
  @Post('createApp')
  createApp(@Body() appBody: AppDto) {
    return this.appsServices.createApp(appBody);
  }
  @Patch('updateApp/:token')
  updateApp(@Body() appBody: AppDto, @Param('token') token: string) {
    return this.appsServices.updateApp(appBody, token);
  }
  @Get('allApps')
  allApps() {
    return this.appsServices.allApps();
  }
  @Get('appByToken/:token')
  appByToken(@Param('token') token: string) {
    return this.appsServices.appByToken(token);
  }
}
