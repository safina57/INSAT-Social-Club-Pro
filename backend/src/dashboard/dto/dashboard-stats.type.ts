import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ApplicationsByStatus } from './applications-by-status.type';
import { TimeFrameData } from './time-frame-data.type';

@ObjectType()
export class DashboardStats {
  @Field(() => Int)
  totalUsers: number;

  @Field(() => Int)
  totalCompanies: number;

  @Field(() => Int)
  totalJobs: number;

  @Field(() => Int)
  totalApplications: number;

  @Field(() => Int)
  totalPosts: number;

  @Field(() => ApplicationsByStatus)
  applicationsByStatus: ApplicationsByStatus;

  @Field(() => [TimeFrameData])
  userSignupsPerTimeFrame: TimeFrameData[];
}
