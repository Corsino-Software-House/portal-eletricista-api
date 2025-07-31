import { Test, TestingModule } from '@nestjs/testing';
import { CreditoUsoService } from './credito-uso.service';

describe('CreditoUsoService', () => {
  let service: CreditoUsoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreditoUsoService],
    }).compile();

    service = module.get<CreditoUsoService>(CreditoUsoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
