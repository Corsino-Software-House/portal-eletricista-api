import { Test, TestingModule } from '@nestjs/testing';
import { CreditoUsoController } from './credito-uso.controller';

describe('CreditoUsoController', () => {
  let controller: CreditoUsoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreditoUsoController],
    }).compile();

    controller = module.get<CreditoUsoController>(CreditoUsoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
