import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  rental_id!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  user_id!: number;

  @ApiProperty({ example: 'Bonjour, ce bien est-il disponible ?' })
  @IsString()
  @MinLength(1)
  message!: string;
}
