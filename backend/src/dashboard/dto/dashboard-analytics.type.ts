import { ObjectType, Field } from "@nestjs/graphql";
import { DashboardStats } from "./dashboard-stats.type";
import { TimeFrameData } from "./time-frame-data.type";

@ObjectType()
export class DashboardAnalytics extends DashboardStats {
  @Field(() => [TimeFrameData])
  postsPerTimeFrame: TimeFrameData[];
}