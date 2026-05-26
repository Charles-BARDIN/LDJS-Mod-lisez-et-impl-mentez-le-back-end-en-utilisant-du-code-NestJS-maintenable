import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { MessagesRepository } from './messages.repository';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  // Enregistre un message ; une référence inexistante est traitée comme une donnée invalide.
  async create(dto: CreateMessageDto): Promise<{ message: string }> {
    try {
      await this.messagesRepository.create({
        rental_id: dto.rental_id,
        user_id: dto.user_id,
        message: dto.message,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException('Validation error');
      }
      throw error;
    }
    return { message: 'Message sent!' };
  }
}
