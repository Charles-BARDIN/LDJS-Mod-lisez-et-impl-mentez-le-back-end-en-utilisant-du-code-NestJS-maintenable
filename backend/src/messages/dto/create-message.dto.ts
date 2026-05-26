import { IsInt, IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  rental_id!: number;

  @IsInt()
  user_id!: number;

  @IsString()
  @MinLength(1)
  message!: string;
}
