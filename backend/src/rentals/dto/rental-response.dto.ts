// Représentation d'une location renvoyée au client, avec son propriétaire.
export class RentalResponseDto {
  id!: number;
  name!: string;
  surface!: number;
  price!: number;
  picture!: string | null;
  description!: string;
  owner!: { id: number; name: string };
  created_at!: Date;
  updated_at!: Date;
}
