// src/auth/auth.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
async login(@Body() loginDto: LoginDto) {
  const result = await this.authService.login(loginDto);
  if (!result) {
    throw new BadRequestException('Credenciais inválidas');
  }
  return result; 
}
}
