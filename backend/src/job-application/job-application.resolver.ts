import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { JobApplicationService } from "./job-application.service";
import { JobApplication } from "./entities/job-application.entity";
import { ApplyJobInput } from "./dto/apply-job.input";
import { ApplicationStatus } from "./enum/application-status.enum";

@Resolver(() => JobApplication)
export class JobApplicationResolver {
  constructor(private readonly service: JobApplicationService) {}

  @Mutation(() => JobApplication)
  applyToJob(
    @Args('input') input: ApplyJobInput,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.service.apply(input.jobId, userId);
  }

  @Query(() => [JobApplication])
  myApplications(@Context() context) {
    const userId = context.req.user.id;
    return this.service.getApplicationsByUser(userId);
  }

  @Query(() => [JobApplication])
  applicantsForJob(@Args('jobId') jobId: string) {
    return this.service.getApplicantsForJob(jobId);
  }

  @Mutation(() => JobApplication)
changeApplicationStatus(
  @Args('applicationId') applicationId: string,
  @Args('status', { type: () => ApplicationStatus }) status: ApplicationStatus,
  @Context() context
) {
  const managerId = context.req.user.id;
  return this.service.changeStatus(applicationId, status, managerId);
}

}
