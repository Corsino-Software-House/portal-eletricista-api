import { Module } from '@nestjs/common';
import { CreditoUsoService } from './credito-uso.service';
import { CreditoUsoController } from './credito-uso.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CreditoUsoService],
  controllers: [CreditoUsoController]
})
export class CreditoUsoModule {}
