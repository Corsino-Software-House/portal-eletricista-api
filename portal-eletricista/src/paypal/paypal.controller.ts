// paypal.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { SubscriptionService } from '../subscription/subscription.service';

@Controller('paypal')
export class PaypalController {
  constructor(
    private readonly paypalService: PaypalService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post('create-order')
  createOrder(@Body() body: { value: string }) {
    return this.paypalService.createOrder(body.value);
  }

  @Post('capture-order')
  async captureOrder(
    @Body()
    body: {
      orderId: string;
      profissionalId: number;
      pacote: 'Básico' | 'Poupança' | 'Profissional' | 'Elite';
    },
  ) {
    const result = await this.paypalService.captureOrder(body.orderId);

    if (!result?.status || result.status !== 'COMPLETED') {
      throw new BadRequestException('Pagamento não foi completado.');
    }

    const pacoteInfo = {
      'Básico': { preco: 25, creditos: 20, dias: 30 },
      'Poupança': { preco: 60, creditos: 60, dias: 30 },
      'Profissional': { preco: 90, creditos: 100, dias: 30 },
      'Elite': { preco: 120, creditos: 150, dias: 30 },
    }[body.pacote];

    if (!pacoteInfo) {
      throw new BadRequestException('Pacote inválido.');
    }

    const existing = await this.subscriptionService.findByProfessional(body.profissionalId);
    const ativa = existing.find((s) => s.status === 'ativa');
    if (ativa) {
      throw new BadRequestException('Profissional já possui uma assinatura ativa.');
    }

    const dataFim = new Date();
    dataFim.setDate(dataFim.getDate() + pacoteInfo.dias);

    const created = await this.subscriptionService.create({
      profissionalId: body.profissionalId,
      pacote: body.pacote,
      valorPago: pacoteInfo.preco,
      creditosTotais: pacoteInfo.creditos,
      creditosRestantes: pacoteInfo.creditos,
      dataFim: dataFim,
    });

    await this.subscriptionService.setActiveSubscription(body.profissionalId, created.id);

    return {
      message: 'Assinatura criada com sucesso.',
      assinatura: created,
    };
  }
}
