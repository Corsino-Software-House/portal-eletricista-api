import { Controller, Post, Get, Delete, Param, Body,Patch, Put } from '@nestjs/common';
import { RequestService } from './request.service';
import { TempoProjeto } from '@prisma/client';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('create')
  create(@Body() body: { clienteId:number,titulo:string,descricao: string,cidade:string,bairro:string,especialidade:string,tempo: TempoProjeto,contato:string }) {
    return this.requestService.create({
      titulo: body.titulo,
      descricao: body.descricao,
      cidade: body.cidade,
      bairro: body.bairro,
      cliente: { connect: { id: body.clienteId } },
      especialidade: body.especialidade,
      tempo: body.tempo,
      status: 'ESPERA',
      contato: body.contato,  
    });
  }
  @Get('total')
  totalRequests() {
    return this.requestService.totalRequests();
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
  @Get(':id')
  find(@Param('id') id: string) {
    return this.requestService.findOne(Number(id));
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.requestService.remove(Number(id));
  }

  @Put('atualiza-creditos/:id')
  atualizaCreditos(
    @Param('id') id: string,
    @Body() body: { creditos: number },
  ) {
    return this.requestService.atualizaCreditos(Number(id), body.creditos);
  }

  @Patch(':id/concluir')
concluir(@Param('id') id: string) {
  return this.requestService.concluir(Number(id));
}

 @Patch(':id/aprovar')
aprovar(@Param('id') id: string) {
  return this.requestService.concluir(Number(id));
}



}
