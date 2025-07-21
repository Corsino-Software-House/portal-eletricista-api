import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';


@Module({
  imports: [PrismaModule],
  providers: [AppointmentService],
  controllers: [AppointmentController]
})
export class AppointmentModule {}
