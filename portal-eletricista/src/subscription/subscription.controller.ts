import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('create')
  async create(@Body() body: any) {
    const { profissionalId, pacote, dataFim } = body;

    const pacoteInfo = {
      'Básico': { preco: 25, creditos: 20 },
      'Poupança': { preco: 60, creditos: 60 },
      'Profissional': { preco: 90, creditos: 100 },
      'Elite': { preco: 120, creditos: 150 },
    }[pacote];

    if (!pacoteInfo) {
      throw new BadRequestException('Pacote inválido');
    }

    // Verifica se já existe assinatura ativa para esse profissional
    const existing = await this.subscriptionService.findByProfessional(profissionalId);
    const ativa = existing.find((s) => s.status === 'ativa');

    if (ativa) {
      throw new BadRequestException('Profissional já possui uma assinatura ativa');
    }

    const created = await this.subscriptionService.create({
  profissionalId,
  pacote,
  valorPago: pacoteInfo.preco,
  creditosTotais: pacoteInfo.creditos,
  creditosRestantes: pacoteInfo.creditos,
  dataFim: new Date(dataFim),
});

    await this.subscriptionService.setActiveSubscription(profissionalId, created.id);

    return created;
  }

  @Get()
  findAll() {
    return this.subscriptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionService.findOne(+id);
  }

  @Get('/profissional/:profissionalId')
  findByProfessional(@Param('profissionalId') profissionalId: string) {
    return this.subscriptionService.findByProfessional(+profissionalId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.subscriptionService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(+id);
  }
}
