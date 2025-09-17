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
import { OtpService } from './otp/otp.service';
import { OtpController } from './otp/otp.controller';
import { OtpModule } from './otp/otp.module';
import {MailService } from './mail-service/mail-service.service';
import { MailServiceController } from './mail-service/mail-service.controller';
import { MailServiceModule } from './mail-service/mail-service.module';
import { StripeService } from './stripe/stripe.service';
import { StripeController } from './stripe/stripe.controller';
import { StripeModule } from './stripe/stripe.module';

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
    OtpModule,
    MailServiceModule,
    StripeModule,
  ],
  controllers: [AppController, PaypalController, OtpController, MailServiceController, StripeController],
  providers: [AppService, PrismaService, PaypalService, OtpService, MailService, StripeService],
})
export class AppModule {}
