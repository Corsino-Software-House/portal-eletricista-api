import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ClienteModule } from './cliente/cliente.module';
import { ProfissionalModule } from './profissional/profissional.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReviewModule } from './review/review.module';
import { AppointmentModule } from './appointment/appointment.module';
import { RequestModule } from './request/request.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { CreditoUsoModule } from './credito-uso/credito-uso.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [AuthModule, ClienteModule, ProfissionalModule, AdminModule, PrismaModule, ReviewModule, AppointmentModule, RequestModule, SubscriptionModule, CreditoUsoModule, WebhookModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
