import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Prisma } from '@prisma/client';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('create')
  create(@Body() data: Prisma.AppointmentCreateInput) {
    return this.appointmentService.create(data);
  }

  @Get('all')
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.AppointmentUpdateInput) {
    return this.appointmentService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }

  @Get('cliente/:clienteId')
  findByClienteId(@Param('clienteId') clienteId: string) {
    return this.appointmentService.findByClienteId(+clienteId);
  }

  @Get('profissional/:profissionalId')
  findByProfissionalId(@Param('profissionalId') profissionalId: string) {
    return this.appointmentService.findByProfissionalId(+profissionalId);
  }
}
