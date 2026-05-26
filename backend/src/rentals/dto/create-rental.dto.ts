import { Type } from 'class-transformer';
import { IsNumber, IsString, MinLength } from 'class-validator';

// Champs texte envoyés en multipart/form-data (l'image est gérée à part).
export class CreateRentalDto {
  @IsString()
  @MinLength(1)
  name!: string;

  // Les champs multipart arrivent en string : @Type les convertit en nombre.
  @Type(() => Number)
  @IsNumber()
  surface!: number;

  @Type(() => Number)
  @IsNumber()
  price!: number;

  @IsString()
  @MinLength(1)
  description!: string;
}
