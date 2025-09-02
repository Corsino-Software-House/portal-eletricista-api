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


async seeAll() {
    return this.prisma.profissional.findMany();
  }

async completeProfile(data: {
  id: number;
  bio: string;
  telefone: string;
  especialidades: string[];
  fotoUrl?: string | null;
  fotoFrenteUrl?: string | null;
  fotoVersoUrl?: string | null;
}) {
  return this.prisma.profissional.update({
    where: { id: Number(data.id) },
    data: {
      bio: data.bio,
      telefone: data.telefone,
      especialidades: data.especialidades,
      ...(data.fotoUrl && { fotoUrl: data.fotoUrl }),
      ...(data.fotoFrenteUrl && { fotoFrenteUrl: data.fotoFrenteUrl }),
      ...(data.fotoVersoUrl && { fotoVersoUrl: data.fotoVersoUrl }),
    },
  });
}


    async updateProfile(data: {
  id: number;
  nome?: string;
  email?: string;
   telefone?: string;
  fotoUrl?: string;
  bio?: string;
}) {
  const profissional = await this.prisma.profissional.findUnique({ where: { id:Number(data.id) } });

  if (!profissional) {
    throw new Error('Cliente não encontrado');
  }

  return this.prisma.profissional.update({
    where: { id:  Number(data.id) },
    data: {
      nome: data.nome,
      email: data.email,
      fotoUrl: data.fotoUrl,
      telefone: data.telefone,
      bio: data.bio,
    },
  });
}

async changePassword(data: { id: number; senhaAtual: string; novaSenha: string }) {
  const profissional = await this.prisma.profissional.findUnique({ where: { id:  Number(data.id) } });

  if (!profissional) {
    throw new Error('Profissional não encontrado');
  }

  const senhaValida = await bcrypt.compare(data.senhaAtual, profissional.senha);
  if (!senhaValida) {
    throw new Error('Senha atual incorreta');
  }

  const novaSenhaHash = await bcrypt.hash(data.novaSenha, 10);

  return this.prisma.profissional.update({
    where: { id:  Number(data.id) },
    data: { senha: novaSenhaHash },
  });
}


 async findByEmail(email: string) {
    return this.prisma.profissional.findUnique({ where: { email } });
  }

   async findById(id: number) {
  if (id === undefined || id === null) {
    throw new Error('ID do profissional não foi fornecido.');
  }
  return this.prisma.profissional.findUnique({
    where: { id },
  });
}
  async findTopAvaliados() {
  return this.prisma.profissional.findMany({
    orderBy: {
      notaMedia: 'desc',
    },
    take: 3,
    select: {
      id: true,
      nome: true,
      fotoUrl: true,
      notaMedia: true,
    },
  });
}

async contarProfissionais() {
  return this.prisma.profissional.count();
}

async deletarProfissional(id: number) {
  const profissional = await this.prisma.profissional.findUnique({ where: { id } });

  if (!profissional) {
    throw new Error('Profissional não encontrado');
  }

  return this.prisma.profissional.delete({
    where: { id },
  });
}
}
