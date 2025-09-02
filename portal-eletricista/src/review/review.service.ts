import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from 'src/mail-service/mail-service.service';


@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService,
    private readonly emailService: MailService,
  ) {}

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

  // Atualiza a média do profissional
  const reviews = await this.prisma.review.findMany({
    where: { profissionalId: data.profissionalId },
    select: { nota: true },
  });

  const totalNotas = reviews.reduce((acc, curr) => acc + curr.nota, 0);
  const media = totalNotas / reviews.length;
  const mediaArredondada = parseFloat(media.toFixed(2));

  await this.prisma.profissional.update({
    where: { id: data.profissionalId },
    data: { notaMedia: mediaArredondada },
  });

  // Envia email para todos os administradores
  try {
    const admins = await this.prisma.admin.findMany({
      select: { email: true, nome: true },
    });

    const adminEmails = admins.map((a) => a.email).filter(Boolean);

    if (adminEmails.length > 0) {
      await this.emailService.sendEmail(
        adminEmails,
        'Nova Review registrada!',
        `Olá, uma nova review foi enviada por um cliente. Confira no painel administrativo.`,
        `<p>Olá Administrador(a),</p>
         <p>Uma nova review foi registrada por um cliente.</p>
         <p><strong>Nota:</strong> ${review.nota}<br>
            <strong>Comentário:</strong> ${review.comentario || '-'}</p>
         <p>Confira no painel administrativo para mais detalhes.</p>`
      );
    }
  } catch (error) {
    console.error('Erro ao enviar email para admins:', error);
  }

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

 async findRecentReviews() {
  return this.prisma.review.findMany({
    orderBy: { criadoEm: 'desc' },
    take: 3,
    include: {
      cliente: {
        select: {
          nome: true,
        },
      },
    },
  });
}

async aprovar(id: number) {
  console.log("ID recebido para aprovação:", id); // Log do ID recebido
  return this.prisma.review.update({
    where: { id },
    data: { status: 'APROVADO' },
  });
}

async negar(id: number) {
  return this.prisma.review.update({
    where: { id },
    data: { status: 'REPROVADO' },
  });
}
async excluir(id: number) {
  return this.prisma.review.delete({
    where: { id },
  });
}
}

