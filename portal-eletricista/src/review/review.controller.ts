import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
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
}
