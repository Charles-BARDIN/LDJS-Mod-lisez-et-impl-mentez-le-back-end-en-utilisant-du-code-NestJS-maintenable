import { Injectable } from '@nestjs/common';
import { Prisma, Rental } from '@prisma/client';
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

  findById(id: number): Promise<RentalWithOwner | null> {
    return this.prisma.rental.findUnique({
      where: { id },
      include: { owner: true },
    });
  }

  create(data: Prisma.RentalUncheckedCreateInput): Promise<Rental> {
    return this.prisma.rental.create({ data });
  }

  update(id: number, data: Prisma.RentalUncheckedUpdateInput): Promise<Rental> {
    return this.prisma.rental.update({ where: { id }, data });
  }
}
