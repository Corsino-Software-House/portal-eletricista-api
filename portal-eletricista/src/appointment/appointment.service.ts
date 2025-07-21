import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AppointmentCreateInput) {
    return this.prisma.appointment.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.appointment.findMany({
      include: {
        cliente: true,
        profissional: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: {
        cliente: true,
        profissional: true,
      },
    });
  }

  async update(id: number, data: Prisma.AppointmentUpdateInput) {
    return this.prisma.appointment.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.appointment.delete({
      where: { id },
    });
  }

  async findByProfissionalId(profissionalId: number) {
    return this.prisma.appointment.findMany({
      where: { profissionalId },
      orderBy: { dataHora: 'asc' },
    });
  }

  async findByClienteId(clienteId: number) {
    return this.prisma.appointment.findMany({
      where: { clienteId },
      orderBy: { dataHora: 'asc' },
    });
  }
}
