import { Test, TestingModule } from '@nestjs/testing';
import { ContactReportResolver } from './contact-report.resolver';

describe('ContactReportResolver', () => {
  let resolver: ContactReportResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactReportResolver],
    }).compile();

    resolver = module.get<ContactReportResolver>(ContactReportResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
