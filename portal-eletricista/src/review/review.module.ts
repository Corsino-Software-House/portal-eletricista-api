
import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailServiceModule } from 'src/mail-service/mail-service.module';

@Module({
  imports: [PrismaModule, MailServiceModule],
  controllers: [ReviewController],
  providers: [ReviewService, PrismaModule],
})
export class ReviewModule {}
