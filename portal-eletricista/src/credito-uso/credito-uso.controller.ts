import { Controller, Post, Get, Body, Param, BadRequestException } from '@nestjs/common';
import { CreditoUsoService } from './credito-uso.service';

@Controller('creditos')
export class CreditoUsoController {
  constructor(private readonly creditoUsoService: CreditoUsoService) {}

  @Post('usar')
  async usarCredito(@Body() body: any) {
    const { subscriptionId, requestId, profissionalId, quantidade } = body;

    if (!subscriptionId || !profissionalId || !quantidade) {
      throw new BadRequestException('Dados incompletos');
    }

    return this.creditoUsoService.registrarUso({
      subscriptionId,
      requestId,
      profissionalId,
      quantidade,
    });
  }

  @Get('profissional/:profissionalId')
  listarUsos(@Param('profissionalId') profissionalId: string) {
    return this.creditoUsoService.listarUsos(+profissionalId);
  }
}
