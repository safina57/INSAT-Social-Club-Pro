import { Resolver, Query, Args } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { DashboardAnalytics } from './dto/dashboard-analytics.type';
import { TimeFrame } from './enums/timeframe.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';

@Roles(Role.ADMIN)
@Resolver()
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => DashboardAnalytics)
  async dashboardAnalytics(
    @Args('timeframe', { type: () => TimeFrame })
    timeFrame: TimeFrame,
  ): Promise<DashboardAnalytics> {
    return this.dashboardService.getAnalytics(timeFrame);
  }
}
