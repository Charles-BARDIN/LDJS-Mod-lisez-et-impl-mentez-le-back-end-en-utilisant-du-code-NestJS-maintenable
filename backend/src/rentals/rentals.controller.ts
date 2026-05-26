import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

// Stockage des images sur disque dans /uploads avec un nom de fichier unique.
const pictureStorage = diskStorage({
  destination: './uploads',
  filename: (_req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(
      file.originalname,
    )}`;
    callback(null, uniqueName);
  },
});

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  // Renvoie la liste de toutes les locations avec leur propriétaire.
  @Get()
  findAll() {
    return this.rentalsService.findAll();
  }

  // Renvoie le détail d'une location.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentalsService.findById(id);
  }

  // Crée une location (image envoyée en multipart/form-data).
  @Post()
  @UseInterceptors(FileInterceptor('picture', { storage: pictureStorage }))
  create(
    @Body() dto: CreateRentalDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.rentalsService.create(dto, file, user.userId);
  }

  // Met à jour une location existante.
  @Put(':id')
  @UseInterceptors(FileInterceptor('picture', { storage: pictureStorage }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRentalDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.rentalsService.update(id, dto, file);
  }
}
