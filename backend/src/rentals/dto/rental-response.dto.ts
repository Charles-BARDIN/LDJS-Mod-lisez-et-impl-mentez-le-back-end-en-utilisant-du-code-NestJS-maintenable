import { ApiProperty } from '@nestjs/swagger';

// Représentation d'une location renvoyée au client, avec son propriétaire.
export class RentalResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Appartement Paris' })
  name!: string;

  @ApiProperty({ example: 50 })
  surface!: number;

  @ApiProperty({ example: 1200 })
  price!: number;

  @ApiProperty({
    example: 'http://localhost:3001/uploads/photo.png',
    nullable: true,
  })
  picture!: string | null;

  @ApiProperty({ example: 'Bel appartement au coeur de Paris' })
  description!: string;

  @ApiProperty({ example: { id: 1, name: 'Patrick' } })
  owner!: { id: number; name: string };

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;
}
