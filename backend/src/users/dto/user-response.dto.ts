// Représentation publique d'un utilisateur (sans le mot de passe).
export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}
