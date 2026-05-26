import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

// Location accompagnée de son propriétaire.
export type RentalWithOwner = Prisma.RentalGetPayload<{
  include: { owner: true };
}>;

// Seul point d'accès à la table RENTALS.
@Injectable()
export class RentalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<RentalWithOwner[]> {
    return this.prisma.rental.findMany({ include: { owner: true } });
  }
}
