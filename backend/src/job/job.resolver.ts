import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { JobService } from './job.service';
import { Job } from './entities/job.entity';
import { CreateJobInput } from './dto/create-job.input';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Paginated } from 'src/common/factories/paginated.factory';
const paginatedJobs = Paginated(Job);
@Resolver(() => Job)
export class JobResolver {
  constructor(private readonly jobService: JobService) {}

  @Mutation(() => Job)
  createJob(
    @Args('createJobInput') createJobInput: CreateJobInput,
    @GetUser() user: User,
  ) {
    const userId = user.id;
    return this.jobService.create(createJobInput, userId);
  }

  @Query(() => paginatedJobs)
  jobs(
    @Args('paginationDto', { type: () => PaginationDto, nullable: true })
    paginationDto?: PaginationDto,
  ) {
    return this.jobService.findAll(paginationDto ?? {});
  }

  @Query(() => Job)
  job(@Args('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Query(() => paginatedJobs)
  jobsByCompany(
    @Args('companyId') companyId: string,
    @Args('paginationDto', { type: () => PaginationDto, nullable: true })
    paginationDto?: PaginationDto,
  ) {
    return this.jobService.findByCompany(companyId, paginationDto);
  }
}
