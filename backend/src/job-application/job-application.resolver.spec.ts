import { Test, TestingModule } from '@nestjs/testing';
import { JobApplicationResolver } from './job-application.resolver';

describe('JobApplicationResolver', () => {
  let resolver: JobApplicationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobApplicationResolver],
    }).compile();

    resolver = module.get<JobApplicationResolver>(JobApplicationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
