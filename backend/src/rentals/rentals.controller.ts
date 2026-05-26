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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RentalsService } from './rentals.service';
import { RentalResponseDto } from './dto/rental-response.dto';
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

// Schéma multipart documenté pour Swagger (champs texte + fichier image).
const rentalMultipartSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    surface: { type: 'number' },
    price: { type: 'number' },
    description: { type: 'string' },
    picture: { type: 'string', format: 'binary' },
  },
};

@ApiTags('rentals')
@ApiBearerAuth()
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  // Renvoie la liste de toutes les locations avec leur propriétaire.
  @Get()
  @ApiOperation({ summary: 'Lister toutes les locations' })
  @ApiResponse({ status: 200, description: 'Liste des locations' })
  findAll() {
    return this.rentalsService.findAll();
  }

  // Renvoie le détail d'une location.
  @Get(':id')
  @ApiOperation({ summary: "Renvoyer le détail d'une location" })
  @ApiResponse({ status: 200, type: RentalResponseDto })
  @ApiResponse({ status: 404, description: 'Location introuvable' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentalsService.findById(id);
  }

  // Crée une location (image envoyée en multipart/form-data).
  @Post()
  @UseInterceptors(FileInterceptor('picture', { storage: pictureStorage }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: rentalMultipartSchema })
  @ApiOperation({ summary: 'Créer une location avec une image' })
  @ApiResponse({ status: 201, description: 'Location créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: rentalMultipartSchema })
  @ApiOperation({ summary: 'Mettre à jour une location' })
  @ApiResponse({ status: 200, description: 'Location mise à jour' })
  @ApiResponse({ status: 404, description: 'Location introuvable' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRentalDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.rentalsService.update(id, dto, file);
  }
}
