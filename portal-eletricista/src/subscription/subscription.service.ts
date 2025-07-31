import { Injectable } from '@nestjs/common';
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

  async create(data: any) {
    return this.prisma.subscription.create({ data });
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
}
