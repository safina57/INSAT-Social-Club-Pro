import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { JobService } from './job.service';
import { Job } from './entities/job.entity';
import { CreateJobInput } from './dto/create-job.input';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@Resolver(() => Job)
export class JobResolver {
  constructor(private readonly jobService: JobService) {}

  @Mutation(() => Job)
  createJob(
    @Args('createJobInput') createJobInput: CreateJobInput,
    @GetUser() user: User
  ) {
    const userId = user.id;
    return this.jobService.create(createJobInput, userId);
  }

  @Query(() => [Job])
  jobs() {
    return this.jobService.findAll();
  }

  @Query(() => Job)
  job(@Args('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Query(() => [Job])
  jobsByCompany(@Args('companyId') companyId: string) {
    return this.jobService.findByCompany(companyId);
  }
}
