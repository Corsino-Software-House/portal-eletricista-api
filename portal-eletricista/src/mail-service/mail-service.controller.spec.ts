import { Test, TestingModule } from '@nestjs/testing';
import { MailServiceController } from './mail-service.controller';

describe('MailServiceController', () => {
  let controller: MailServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailServiceController],
    }).compile();

    controller = module.get<MailServiceController>(MailServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
