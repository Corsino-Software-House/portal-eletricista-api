import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.RequestCreateInput) {
    return this.prisma.request.create({ data });
  }

  findAll() {
    return this.prisma.request.findMany({
      include: { cliente: true },
    });
  }
  findByCliente(clienteId: number) {
    return this.prisma.request.findMany({
      where: { clienteId },
      
    });
  }

  findOne(id: number) {
    return this.prisma.request.findUnique({
      where: { id },
      include: { cliente: true },
    });
  }

  remove(id: number) {
    return this.prisma.request.delete({
      where: { id },
    });
  }

  async concluir(id: number) {
  return this.prisma.request.update({
    where: { id },
    data: { status: 'concluido' },
  });
}

  async atualizaCreditos(id: number, creditos: number) {
    return this.prisma.request.update({
      where: { id },
      data: { creditos },
    });
  }

  async totalRequests() {
    return this.prisma.request.count();
  }
}
