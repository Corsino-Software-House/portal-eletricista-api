import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('create-order')
  createOrder(
    @Body()
    body: {
      value: string;
      profissionalId: number;
      pacote: 'Básico' | 'Poupança' | 'Profissional' | 'Elite';
    },
  ) {
    if (!body.profissionalId || !body.pacote || !body.value) {
      throw new BadRequestException('Dados incompletos.');
    }

    return this.paypalService.createOrder(body.value, body.profissionalId, body.pacote);
  }

  @Post('capture-order')
  async captureOrder(
    @Body()
    body: { orderId: string },
  ) {
    const result = await this.paypalService.captureOrder(body.orderId);

    if (!result?.status || result.status !== 'COMPLETED') {
      throw new BadRequestException('Pagamento não foi completado.');
    }

    return {
      message: 'Pagamento capturado com sucesso.',
      detalhes: result,
    };
  }

  @Post('webhook')
  async handleWebhook(@Body() payload: any) {
    const eventType = payload?.event_type;
    const orderId =
      payload?.resource?.id || payload?.resource?.supplementary_data?.related_ids?.order_id;

    if (!orderId) {
      throw new BadRequestException('ID do pedido não encontrado no payload.');
    }

    console.log(`🎯 Webhook recebido: ${eventType} para orderId ${orderId}`);

    if (eventType === 'CHECKOUT.ORDER.APPROVED') {
  const result = await this.paypalService.captureOrder(orderId);

  if (result?.status === 'COMPLETED') {
    await this.paypalService.criarAssinaturaPorWebhook(orderId);
  } else {
    throw new BadRequestException('Pagamento não foi completado após aprovação.');
  }
}

    return { received: true };
  }
}
