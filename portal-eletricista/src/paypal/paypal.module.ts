import { Module } from '@nestjs/common';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { PaypalController } from './paypal.controller';

@Module({})
export class PaypalModule {
  imports: [SubscriptionModule];
    controllers: [PaypalController];
}

