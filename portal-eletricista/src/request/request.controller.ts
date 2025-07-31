import { Controller, Post, Get, Delete, Param, Body,Patch } from '@nestjs/common';
import { RequestService } from './request.service';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('create')
  create(@Body() body: { clienteId:number,titulo:string,descricao: string,cidade:string,bairro:string,especialidade:string }) {
    return this.requestService.create({
      titulo: body.titulo,
      descricao: body.descricao,
      cidade: body.cidade,
      bairro: body.bairro,
      cliente: { connect: { id: body.clienteId } },
      especialidade: body.especialidade,
    });
  }

  @Get('all')
  findAll() {
    return this.requestService.findAll();
  }

  @Get('cliente/:clienteId')
  findByCliente(@Param('clienteId') clienteId: string) {
    return this.requestService.findByCliente(Number(clienteId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestService.remove(Number(id));
  }

  @Patch(':id/concluir')
concluir(@Param('id') id: string) {
  return this.requestService.concluir(Number(id));
}
}
