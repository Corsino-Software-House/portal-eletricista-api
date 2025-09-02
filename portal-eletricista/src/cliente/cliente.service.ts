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

  async completeProfile(data: { id:number, fotoUrl: string, telefone: string }) {
    console.log('ID recebido:', data.id, '| Tipo:', typeof data.id);
    return this.prisma.cliente.update({
      where: { id: Number(data.id) },
      data: { fotoUrl: data.fotoUrl , telefone: data.telefone },
    });
  }

  async updateProfile(data: {
  id: number;
  nome?: string;
  email?:string,
  fotoUrl?: string;
  telefone?: string;
}) {
  const cliente = await this.prisma.cliente.findUnique({ where: { id:  Number(data.id) } });

  if (!cliente) {
    throw new Error('Cliente não encontrado');
  }

  return this.prisma.cliente.update({
    where: { id:  Number(data.id) },
    data: {
      nome: data.nome,
      email: data.email,
      fotoUrl: data.fotoUrl,
      telefone: data.telefone,
    },
  });
}


async changePassword(data: { id: number; senhaAtual: string; novaSenha: string }) {
  const cliente = await this.prisma.cliente.findUnique({ where: { id: Number(data.id)} });

  if (!cliente) {
    throw new Error('cliente não encontrado');
  }

  const senhaValida = await bcrypt.compare(data.senhaAtual, cliente.senha);
  if (!senhaValida) {
    throw new Error('Senha atual incorreta');
  }

  const novaSenhaHash = await bcrypt.hash(data.novaSenha, 10);

  return this.prisma.cliente.update({
    where: { id: Number(data.id) },
    data: { senha: novaSenhaHash },
  });
}

async changePasswordByEmail(data: { email: string; novaSenha: string }) {
  const cliente = await this.prisma.cliente.findUnique({ where: { email: data.email} });

  if (!cliente) {
    throw new Error('cliente não encontrado');
  }

  const novaSenhaHash = await bcrypt.hash(data.novaSenha, 10);

  return this.prisma.cliente.update({
    where: { email: data.email },
    data: { senha: novaSenhaHash },
  });
}

  async findByEmail(email: string) {
    return this.prisma.cliente.findUnique({ where: { email } });
  }

async contarClientes() {
  return this.prisma.cliente.count();
}

async seeAll() {
    return this.prisma.cliente.findMany();
  }

async deletarCliente(id: number) {
  const cliente = await this.prisma.cliente.findUnique({ where: { id } });
  if (!cliente) {
    throw new Error('Cliente não encontrado');
  }
  return this.prisma.cliente.delete({ where: { id } });

}
}
