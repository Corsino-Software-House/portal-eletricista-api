import { Controller, Post, Body, Get } from '@nestjs/common';
import { ClienteService } from './cliente.service';

@Controller('cliente')
export class ClienteController {
  constructor(private service: ClienteService) {}

  @Post('register')
  register(@Body() data: { nome: string; email: string; senha: string }) {
    return this.service.register(data);
  }
  @Get('account')
  getAccount(@Body() data: { email: string }) {
    return this.service.findByEmail(data.email);
  }
}