import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) {}

  async register(data: { nome: string; email: string; senha: string }) {
    const hashed = await bcrypt.hash(data.senha, 10);
    return this.prisma.cliente.create({
      data: { ...data, senha: hashed },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.cliente.findUnique({ where: { email } });
  }
}
