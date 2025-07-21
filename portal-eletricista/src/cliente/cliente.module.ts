import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ClienteService],
  controllers: [ClienteController],
  exports: [ClienteService], // Exporting ClienteService to be used in other modules
})
export class ClienteModule {}
