import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { type: 'cliente' | 'profissional' | 'admin', email: string, senha: string }) {
    const user = await this.authService.validateUser(body.type, body.email, body.senha);
    if (!user) return { error: 'Credenciais inválidas' };

    return this.authService.login(user, body.type);
  }
}