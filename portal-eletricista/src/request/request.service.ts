import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { MailService } from 'src/mail-service/mail-service.service';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService,
    private readonly emailService: MailService,
  ) {}

  async create(data: Prisma.RequestCreateInput) {
    const projeto = await this.prisma.request.create({ data });

    // Busca emails dos admins
    const admins = await this.prisma.admin.findMany({
      select: { email: true },
    });
    const emails = admins.map((a) => a.email);

    if (emails.length > 0) {
      await this.emailService.sendEmail(
        emails,
        'Novo projeto postado 🚀',
        `Um novo projeto foi criado: ${projeto.titulo}`,
        `
          <h2>Um novo projeto foi criado!</h2>
          <p><strong>Título:</strong> ${projeto.titulo}</p>
          <p><strong>Descrição:</strong> ${projeto.descricao}</p>
          <p><strong>Status:</strong> ${projeto.status}</p>
        `,
      );
    }

    return projeto;
  }

  findAll() {
    return this.prisma.request.findMany({
      include: { cliente: true },
    });
  }

  findDisponiveis() {
    return this.prisma.request.findMany({
      where: { status: 'ABERTO' },
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
    data: { status: 'CONCLUIDO' },
  });
}

async aprovar(id: number) {
  return this.prisma.request.update({
    where: { id },
    data: { status: 'ABERTO' },
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
