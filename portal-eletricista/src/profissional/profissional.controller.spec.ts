import { Test, TestingModule } from '@nestjs/testing';
import { ProfissionalController } from './profissional.controller';

describe('ProfissionalController', () => {
  let controller: ProfissionalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfissionalController],
    }).compile();

    controller = module.get<ProfissionalController>(ProfissionalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
