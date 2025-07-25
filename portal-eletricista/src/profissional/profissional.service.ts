import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfissionalService {
    constructor(private prisma: PrismaService){}

    async register(data: { nome: string; email: string; senha: string,cidade: string, bairro: string }) {
    const hased = await bcrypt.hash(data.senha,10);
    return this.prisma.profissional.create({
        data: {...data, senha: hased},
    });
}

  async completeProfile(data: { id:number, bio: string; fotoUrl: string }) {
    console.log('ID recebido:', data.id, '| Tipo:', typeof data.id);
    return this.prisma.profissional.update({
      where: { id: Number(data.id) },
      data: { bio: data.bio, fotoUrl: data.fotoUrl },
    });
  }

 async findByEmail(email: string) {
    return this.prisma.profissional.findUnique({ where: { email } });
  }
}
