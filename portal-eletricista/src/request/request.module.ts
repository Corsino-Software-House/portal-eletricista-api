import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailServiceModule } from 'src/mail-service/mail-service.module';

@Module({
  imports: [PrismaModule,MailServiceModule],
  controllers: [RequestController],
  providers: [RequestService]
})
export class RequestModule {}
