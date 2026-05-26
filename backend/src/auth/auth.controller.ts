import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from './decorators/current-user.decorator';
import { UserResponseDto } from '../users/dto/user-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Crée un compte utilisateur et renvoie un token JWT.
  @Public()
  @HttpCode(200)
  @Post('register')
  @ApiOperation({
    summary: 'Créer un compte utilisateur et renvoyer un token JWT',
  })
  @ApiResponse({ status: 200, description: 'Compte créé, token renvoyé' })
  @ApiResponse({
    status: 400,
    description: 'Email déjà utilisé ou données invalides',
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // Authentifie un utilisateur et renvoie un token JWT.
  @Public()
  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'Se connecter et renvoyer un token JWT' })
  @ApiResponse({ status: 200, description: 'Connexion réussie, token renvoyé' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Renvoie les informations de l'utilisateur connecté (déduit du token).
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Renvoyer l'utilisateur connecté" })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.me(user.userId);
  }
}
