import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  create(data: { clienteId: number; profissionalId: number; comentario: string; nota: number }) {
    return this.prisma.review.create({
      data: {
        clienteId: data.clienteId,
        profissionalId: data.profissionalId,
        comentario: data.comentario,
        nota: data.nota,
      },
    });
  }

  findAll() {
    return this.prisma.review.findMany({ include: { cliente: true, profissional: true } });
  }

  findByProfissionalId(profissionalId: number) {
    return this.prisma.review.findMany({
      where: { profissionalId },
      include: { cliente: true },
    });
  }
}
