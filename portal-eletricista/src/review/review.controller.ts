import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create')
  create(@Body() body: any) {
    return this.reviewService.create(body);
  }

  @Get('all')
  findAll() {
    return this.reviewService.findAll();
  }

  @Get('profissional/:id')
  findByProfissional(@Param('id') id: string) {
    return this.reviewService.findByProfissionalId(Number(id));
  }

  @Get('recent')
findRecent() {
  return this.reviewService.findRecentReviews();
}

@Put('accept/:id')
aprovar(@Param('id') id: string) {
  console.log('ID recebido:', id); // vai mostrar "1"
  return this.reviewService.aprovar(Number(id));
}

@Put('deny/:id')
negar(@Param('id') id: string) {
  return this.reviewService.negar(Number(id));
}

@Delete('delete/:id')
excluir(@Param('id') id: string) {
  return this.reviewService.excluir(Number(id));
}



}
