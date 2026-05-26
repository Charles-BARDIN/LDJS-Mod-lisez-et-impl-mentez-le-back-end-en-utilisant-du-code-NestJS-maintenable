import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Envoie un message au sujet d'une location.
  @HttpCode(200)
  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.messagesService.create(dto);
  }
}
