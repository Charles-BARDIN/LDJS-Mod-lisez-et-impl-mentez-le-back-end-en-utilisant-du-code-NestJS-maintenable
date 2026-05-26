import { Injectable } from '@nestjs/common';
import { RentalsRepository, RentalWithOwner } from './rentals.repository';
import { RentalResponseDto } from './dto/rental-response.dto';

@Injectable()
export class RentalsService {
  constructor(private readonly rentalsRepository: RentalsRepository) {}

  // Renvoie toutes les locations au format attendu par le front.
  async findAll(): Promise<{ rentals: RentalResponseDto[] }> {
    const rentals = await this.rentalsRepository.findAll();
    return { rentals: rentals.map((rental) => this.toResponse(rental)) };
  }

  // Convertit l'entité Prisma en DTO (Decimal -> number, propriétaire réduit à { id, name }).
  private toResponse(rental: RentalWithOwner): RentalResponseDto {
    return {
      id: rental.id,
      name: rental.name,
      surface: Number(rental.surface),
      price: Number(rental.price),
      picture: rental.picture,
      description: rental.description,
      owner: { id: rental.owner.id, name: rental.owner.name },
      created_at: rental.created_at,
      updated_at: rental.updated_at,
    };
  }
}
