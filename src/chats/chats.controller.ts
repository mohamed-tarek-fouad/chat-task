import { Controller, Get, Param, Post } from '@nestjs/common';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsServices: ChatsService) {}
  @Post('newChat/:appToken')
  newChat(@Param('appToken') appToken: string) {
    return this.chatsServices.newChat(appToken);
  }
  @Get('chatsByToken/:appToken')
  chatsByToken(@Param('appToken') appToken: string) {
    return this.chatsServices.chatsByToken(appToken);
  }
  @Get('singleChat/:number/:appToken')
  singleChat(
    @Param('number') number: string,
    @Param('appToken') appToken: string,
  ) {
    return this.chatsServices.singleChat(number, appToken);
  }
}
