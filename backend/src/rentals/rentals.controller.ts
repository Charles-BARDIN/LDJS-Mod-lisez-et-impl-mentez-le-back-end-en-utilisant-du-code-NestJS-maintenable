import { Controller, Get } from '@nestjs/common';
import { RentalsService } from './rentals.service';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  // Renvoie la liste de toutes les locations avec leur propriétaire.
  @Get()
  findAll() {
    return this.rentalsService.findAll();
  }
}
