import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    clienteId: number;
    profissionalId: number;
    nota: number;
    comentario?: string;
    requestId?: number;
  }) {
    // Se requestId for fornecido, verifica se é válido e pertence ao cliente
    if (data.requestId) {
      const request = await this.prisma.request.findUnique({
        where: { id: data.requestId },
      });

      if (!request) {
        throw new BadRequestException('Request não encontrado.');
      }

      if (request.clienteId !== data.clienteId) {
        throw new BadRequestException('Request não pertence ao cliente.');
      }

      // Verifica se já existe review para esse request
      const existingReview = await this.prisma.review.findFirst({
        where: {
          clienteId: data.clienteId,
          requestId: data.requestId,
        },
      });

      if (existingReview) {
        throw new BadRequestException('Review já foi enviado para esse request.');
      }
    }

    // Cria o review
    const review = await this.prisma.review.create({
      data: {
        clienteId: data.clienteId,
        profissionalId: data.profissionalId,
        comentario: data.comentario,
        nota: data.nota,
        requestId: data.requestId,
      },
    });

    // Busca todas as notas do profissional
    const reviews = await this.prisma.review.findMany({
      where: { profissionalId: data.profissionalId },
      select: { nota: true },
    });

    // Calcula a média com 2 casas decimais
    const totalNotas = reviews.reduce((acc, curr) => acc + curr.nota, 0);
    const media = totalNotas / reviews.length;
    const mediaArredondada = parseFloat(media.toFixed(2));

    // Atualiza notaMedia do profissional
    await this.prisma.profissional.update({
      where: { id: data.profissionalId },
      data: { notaMedia: mediaArredondada },
    });

    return review;
  }

  findAll() {
    return this.prisma.review.findMany({
      include: {
        cliente: true,
        profissional: true,
        request: true,
      },
    });
  }

  findByProfissionalId(profissionalId: number) {
    return this.prisma.review.findMany({
      where: { profissionalId },
      include: {
        cliente: true,
        request: true,
      },
    });
  }
}
