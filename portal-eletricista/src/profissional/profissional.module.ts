import { Module } from '@nestjs/common';
import { ProfissionalService } from './profissional.service';
import { ProfissionalController } from './profissional.controller';

@Module({
  providers: [ProfissionalService],
  controllers: [ProfissionalController]
})
export class ProfissionalModule {}
