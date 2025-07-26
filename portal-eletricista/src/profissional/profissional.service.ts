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

  async completeProfile(data: { id:number, bio: string; fotoUrl: string,telefone: string, }) {
    console.log('ID recebido:', data.id, '| Tipo:', typeof data.id);
    return this.prisma.profissional.update({
      where: { id: Number(data.id) },
      data: { bio: data.bio, fotoUrl: data.fotoUrl , telefone: data.telefone },
    });
  }

    async updateProfile(data: {
  id: number;
  nome?: string;
  fotoUrl?: string;
  telefone?: string;
}) {
  const cliente = await this.prisma.profissional.findUnique({ where: { id: data.id } });

  if (!cliente) {
    throw new Error('Cliente não encontrado');
  }

  return this.prisma.profissional.update({
    where: { id:  Number(data.id) },
    data: {
      nome: data.nome,
      fotoUrl: data.fotoUrl,
      telefone: data.telefone,
    },
  });
}

async changePassword(data: { id: number; senhaAtual: string; novaSenha: string }) {
  const profissional = await this.prisma.profissional.findUnique({ where: { id: data.id } });

  if (!profissional) {
    throw new Error('Profissional não encontrado');
  }

  const senhaValida = await bcrypt.compare(data.senhaAtual, profissional.senha);
  if (!senhaValida) {
    throw new Error('Senha atual incorreta');
  }

  const novaSenhaHash = await bcrypt.hash(data.novaSenha, 10);

  return this.prisma.profissional.update({
    where: { id: data.id },
    data: { senha: novaSenhaHash },
  });
}


 async findByEmail(email: string) {
    return this.prisma.profissional.findUnique({ where: { email } });
  }
}
