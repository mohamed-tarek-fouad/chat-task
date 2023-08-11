import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessageDto } from './dtos/message.dto';
import { SearshDto } from './dtos/searsh.dto';

@Controller()
export class MessagesController {
  constructor(private readonly messageServices: MessagesService) {}
  @Post('newMessage/:number/:appToken')
  newMessage(
    @Body() messageBody: MessageDto,
    @Param('number') number: string,
    @Param('appToken') appToken: string,
  ) {
    return this.messageServices.newMessage(messageBody, number, appToken);
  }
  @Patch('updateMessage/:number/:appToken')
  updateMessage(
    @Body() messageBody: MessageDto,
    @Param('number') number: string,
    @Param('appToken') appToken: string,
  ) {
    return this.messageServices.updateMessage(messageBody, number, appToken);
  }
  @Get('allmessages/:number/:appToken')
  allMessages(
    @Param('number') number: string,
    @Param('appToken') appToken: string,
  ) {
    return this.messageServices.allMessages(number, appToken);
  }
  @Post('searsh/:number/:appToken')
  searsh(
    @Param('number') number: string,
    @Param('appToken') appToken: string,
    @Body() searshString: SearshDto,
  ) {
    return this.messageServices.searsh(searshString, number, appToken);
  }
}
