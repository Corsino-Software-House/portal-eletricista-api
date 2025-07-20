import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(type: 'cliente' | 'profissional' | 'admin', email: string, senha: string) {
    let user: any;

    if (type === 'cliente') {
      user = await this.prisma.cliente.findUnique({ where: { email } });
    } else if (type === 'profissional') {
      user = await this.prisma.profissional.findUnique({ where: { email } });
    } else if (type === 'admin') {
      user = await this.prisma.admin.findUnique({ where: { email } });
    }

    if (user && await bcrypt.compare(senha, user.senha)) {
      const { senha, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any, type: string) {
    const payload = { sub: user.id, email: user.email, role: type };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
