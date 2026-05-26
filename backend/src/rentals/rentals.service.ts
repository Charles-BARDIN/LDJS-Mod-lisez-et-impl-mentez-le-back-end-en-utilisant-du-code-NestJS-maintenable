import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RentalsRepository, RentalWithOwner } from './rentals.repository';
import { RentalResponseDto } from './dto/rental-response.dto';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';

@Injectable()
export class RentalsService {
  constructor(
    private readonly rentalsRepository: RentalsRepository,
    private readonly configService: ConfigService,
  ) {}

  // Renvoie toutes les locations au format attendu par le front.
  async findAll(): Promise<{ rentals: RentalResponseDto[] }> {
    const rentals = await this.rentalsRepository.findAll();
    return { rentals: rentals.map((rental) => this.toResponse(rental)) };
  }

  // Renvoie une location ou lève une 404 si elle n'existe pas.
  async findById(id: number): Promise<RentalResponseDto> {
    const rental = await this.rentalsRepository.findById(id);
    if (!rental) {
      throw new NotFoundException('Rental not found');
    }
    return this.toResponse(rental);
  }

  // Crée une location ; l'image est obligatoire et son URL est enregistrée en base.
  async create(
    dto: CreateRentalDto,
    file: Express.Multer.File | undefined,
    ownerId: number,
  ): Promise<{ message: string }> {
    if (!file) {
      throw new BadRequestException('Validation error');
    }
    await this.rentalsRepository.create({
      name: dto.name,
      surface: dto.surface,
      price: dto.price,
      description: dto.description,
      picture: this.buildPictureUrl(file.filename),
      owner_id: ownerId,
    });
    return { message: 'Rental created!' };
  }

  // Met à jour une location existante (champs et image optionnels).
  async update(
    id: number,
    dto: UpdateRentalDto,
    file?: Express.Multer.File,
  ): Promise<{ message: string }> {
    const existing = await this.rentalsRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Rental not found');
    }
    await this.rentalsRepository.update(id, {
      name: dto.name,
      surface: dto.surface,
      price: dto.price,
      description: dto.description,
      ...(file ? { picture: this.buildPictureUrl(file.filename) } : {}),
    });
    return { message: 'Rental updated!' };
  }

  // Construit l'URL publique d'une image stockée sur le serveur.
  private buildPictureUrl(filename: string): string {
    const appUrl = this.configService.getOrThrow<string>('APP_URL');
    return `${appUrl}/uploads/${filename}`;
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
