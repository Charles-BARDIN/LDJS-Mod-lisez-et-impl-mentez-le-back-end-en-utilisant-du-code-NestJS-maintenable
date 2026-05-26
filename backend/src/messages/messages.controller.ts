import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Envoie un message au sujet d'une location.
  @HttpCode(200)
  @Post()
  @ApiOperation({ summary: "Envoyer un message au sujet d'une location" })
  @ApiResponse({ status: 200, description: 'Message envoyé' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Body() dto: CreateMessageDto) {
    return this.messagesService.create(dto);
  }
}
