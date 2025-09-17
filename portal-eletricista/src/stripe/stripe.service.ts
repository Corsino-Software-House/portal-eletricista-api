import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) throw new Error('Variável STRIPE_SECRET_KEY é obrigatória');
    this.stripe = new Stripe(secretKey, { apiVersion: '2025-08-27.basil' });
  }

  async createCheckoutSession(
    profissionalId: number,
    pacote: string,
    valor: number, // em centavos
  ): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Plano ${pacote}`,
              },
              unit_amount: valor,
            },
            quantity: 1,
          },
        ],
        success_url: `${this.configService.get(
          'FRONTEND_URL',
        )}/sucesso`,
        cancel_url: `${this.configService.get('FRONTEND_URL')}/cancelado`,
      });

      // Salva no banco
      await this.prisma.pedidoStripe.create({
        data: {
          orderId: session.id,
          profissionalId,
          pacote,
        },
      });

      return session;
    } catch (error) {
      this.logger.error('Erro ao criar sessão de checkout Stripe', error);
      throw new Error('Não foi possível criar o checkout');
    }
  }

  async markAsProcessed(orderId: string) {
    const pedido = await this.prisma.pedidoStripe.findUnique({ where: { orderId } });
    if (!pedido || pedido.processado) return;

    await this.prisma.pedidoStripe.update({
      where: { id: pedido.id },
      data: { processado: true },
    });

    this.logger.log(`Pedido Stripe ${pedido.id} marcado como processado`);
  }


  async criarAssinaturaPorWebhook(sessionId: string) {
  const pedido = await this.prisma.pedidoStripe.findFirst({ where: { orderId: sessionId } });

  if (!pedido || pedido.processado) return;

  // Define os planos iguais ao do PayPal
  const plano = {
    'Básico': { preco: 25, creditos: 20, dias: 30 },
    'Poupança': { preco: 60, creditos: 60, dias: 30 },
    'Profissional': { preco: 90, creditos: 100, dias: 30 },
    'Elite': { preco: 120, creditos: 150, dias: 30 },
  }[pedido.pacote];

  if (!plano) {
    this.logger.warn(`Pacote inválido: ${pedido.pacote}`);
    return;
  }

  const dataFim = new Date();
  dataFim.setDate(dataFim.getDate() + plano.dias);

  // Cria assinatura
  const nova = await this.prisma.subscription.create({
    data: {
      profissionalId: pedido.profissionalId,
      pacote: pedido.pacote,
      valorPago: plano.preco,
      creditosTotais: plano.creditos,
      creditosRestantes: plano.creditos,
      dataFim: dataFim,
    },
  });

  // Atualiza o profissional
  await this.prisma.profissional.update({
    where: { id: pedido.profissionalId },
    data: { assinaturaAtualId: nova.id },
  });

  // Marca pedido como processado
  await this.prisma.pedidoStripe.update({
    where: { id: pedido.id },
    data: { processado: true },
  });

  this.logger.log(`✅ Assinatura criada via webhook para profissional ${pedido.profissionalId}`);
}

}
