import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  async createCheckout(
    @Body() body: { profissionalId: number; pacote: string; valor: number },
  ) {
    const { profissionalId, pacote, valor } = body;
    const session = await this.stripeService.createCheckoutSession(
      profissionalId,
      pacote,
      valor,
    );
    return { url: session.url };
  }

  // webhook do stripe para confirmar pagamento
 @Post('webhook')
async handleWebhook(@Body() event: any) {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    await this.stripeService.criarAssinaturaPorWebhook(session.id);
  }

  return { received: true };
}
}
