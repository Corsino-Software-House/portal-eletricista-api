import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async setActiveSubscription(profissionalId: number, subscriptionId: number) {
  return this.prisma.profissional.update({
    where: { id: profissionalId },
    data: { assinaturaAtualId: subscriptionId },
  });
}

  async create(data: CreateSubscriptionDto): Promise<Subscription> {
  const assinaturasAtivas = await this.prisma.subscription.findMany({
    where: {
      profissionalId: data.profissionalId,
      status: 'ativa',
    },
  });

  if (assinaturasAtivas.length > 0) {
    throw new BadRequestException('Já existe uma assinatura ativa para este profissional.');
  }

  return this.prisma.subscription.create({
    data,
  });
}

  async findAll() {
    return this.prisma.subscription.findMany();
  }

  async findOne(id: number) {
    return this.prisma.subscription.findUnique({
      where: { id },
    });
  }

  async findByProfessional(profissionalId: number) {
    return this.prisma.subscription.findMany({
      where: { profissionalId },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.subscription.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.subscription.delete({
      where: { id },
    });
  }

  async creditoPorId(profissionalId: number) {
  const subscription = await this.prisma.subscription.findFirst({
    where: { profissionalId, status: 'ativa' },
    select: { creditosRestantes: true },
  });

  if (!subscription) {
    throw new NotFoundException(`Subscription com ID ${profissionalId} não encontrada.`);
  }

  return subscription;
  }

  async somarValorPagoTotal() {
  const resultado = await this.prisma.subscription.aggregate({
    _sum: {
      valorPago: true,
    },
  });

  return resultado._sum.valorPago ?? 0;
}
}
