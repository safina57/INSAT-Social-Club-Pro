import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { JobService } from './job.service';
import { Job } from './entities/job.entity';
import { CreateJobInput } from './dto/create-job.input';

@Resolver(() => Job)
export class JobResolver {
  constructor(private readonly jobService: JobService) {}

  @Mutation(() => Job)
  createJob(
    @Args('createJobInput') createJobInput: CreateJobInput,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.jobService.create(createJobInput, userId);
  }

  @Query(() => [Job], { name: 'jobs' })
  findAll() {
    return this.jobService.findAll();
  }

  @Query(() => Job, { name: 'job' })
  findOne(@Args('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Query(() => [Job], { name: 'jobsByCompany' })
  findByCompany(@Args('companyId') companyId: string) {
    return this.jobService.findByCompany(companyId);
  }
}
