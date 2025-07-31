import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreditoUsoService {
  constructor(private prisma: PrismaService) {}

  async registrarUso(data: {
    subscriptionId: number;
    requestId?: number;
    profissionalId: number;
    quantidade: number;
  }) {
    const { subscriptionId, requestId, profissionalId, quantidade } = data;

    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    if (subscription.profissionalId !== profissionalId) {
      throw new BadRequestException('Assinatura não pertence ao profissional');
    }

    if (subscription.status !== 'ativa') {
      throw new BadRequestException('Assinatura inativa ou expirada');
    }

    if (subscription.creditosRestantes < quantidade) {
      throw new BadRequestException(
        `Créditos insuficientes: disponíveis ${subscription.creditosRestantes}, solicitados ${quantidade}`
      );
    }

    if (quantidade <= 0) {
      throw new BadRequestException('Seus créditos acabaram!');
    }
    const [uso] = await this.prisma.$transaction([
      this.prisma.creditoUso.create({
        data: {
          subscriptionId,
          requestId,
          profissionalId,
          quantidade,
        },
      }),
      this.prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          creditosRestantes: {
            decrement: quantidade,
          },
        },
      }),
    ]);

    return uso;
  }

  async listarUsos(profissionalId: number) {
    return this.prisma.creditoUso.findMany({
      where: { profissionalId },
      include: {
        request: true,
        subscription: true,
      },
      orderBy: { criadoEm: 'desc' },
    });
  }
}
