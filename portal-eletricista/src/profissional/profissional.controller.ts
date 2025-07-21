import { Controller,Post,Body,Put } from '@nestjs/common';
import { ProfissionalService } from './profissional.service';

@Controller('profissional')
export class ProfissionalController {
constructor(private service: ProfissionalService) {}

@Post('register')
register(@Body() data: { nome: string; email: string; senha: string,cidade: string, bairro: string }) {
    return this.service.register(data);
}

@Put('complete-profile')
  completeProfile(@Body() data: { id: number, bio: string; fotoUrl: string }) {
    return this.service.completeProfile(data);
  }
}
