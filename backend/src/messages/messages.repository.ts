import { Injectable } from '@nestjs/common';
import { Message, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

// Seul point d'accès à la table MESSAGES.
@Injectable()
export class MessagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.MessageUncheckedCreateInput): Promise<Message> {
    return this.prisma.message.create({ data });
  }
}
