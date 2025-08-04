import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';  // <-- importe aqui
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
import { PaypalService } from './paypal/paypal.service';
import { PaypalController } from './paypal/paypal.controller';
import { PaypalModule } from './paypal/paypal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,      // fica disponível em todo app
      envFilePath: '.env', // opcional, padrão é .env
    }),
    AuthModule,
    ClienteModule,
    ProfissionalModule,
    AdminModule,
    PrismaModule,
    ReviewModule,
    AppointmentModule,
    RequestModule,
    SubscriptionModule,
    CreditoUsoModule,
    WebhookModule,
    PaypalModule,
  ],
  controllers: [AppController, PaypalController],
  providers: [AppService, PrismaService, PaypalService],
})
export class AppModule {}
