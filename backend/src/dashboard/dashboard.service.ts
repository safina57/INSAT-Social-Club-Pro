// dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardAnalytics } from './dto/dashboard-analytics.type';
import { DashboardStats } from './dto/dashboard-stats.type';
import { TimeFrameData } from './dto/time-frame-data.type';
import { RawDataUtil } from './utils/raw-data.util';
import { TimeFrame } from './enums/timeframe.enum';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(
    timeFrame: TimeFrame = TimeFrame.DAY,
  ): Promise<DashboardStats> {
    const [
      totalUsers,
      totalCompanies,
      totalJobs,
      totalApplications,
      totalPosts,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.company.count(),
      this.prisma.job.count(),
      this.prisma.jobApplication.count(),
      this.prisma.post.count(),
    ]);

    const statuses = await this.prisma.jobApplication.groupBy({
      by: ['status'],
      _count: true,
    });

    const applicationsByStatus = {
      PENDING: 0,
      ACCEPTED: 0,
      REJECTED: 0,
      ...Object.fromEntries(statuses.map((s) => [s.status, s._count])),
    };

    const userSignups = await RawDataUtil.getUserSignups(
      this.prisma,
      timeFrame,
    );

    return {
      totalUsers,
      totalCompanies,
      totalJobs,
      totalApplications,
      totalPosts,
      applicationsByStatus,
      userSignupsPerTimeFrame: userSignups,
    };
  }

  async getPostsPerTimeFrame(timeFrame: TimeFrame): Promise<TimeFrameData[]> {
    return RawDataUtil.getPostsPerTimeFrame(this.prisma, timeFrame);
  }

  async getAnalytics(
    timeFrame: TimeFrame = TimeFrame.DAY,
  ): Promise<DashboardAnalytics> {
    const [dashboardStats, postsPerTimeFrame] = await Promise.all([
      this.getDashboardStats(timeFrame),
      this.getPostsPerTimeFrame(timeFrame),
    ]);

    return {
      ...dashboardStats,
      postsPerTimeFrame,
    };
  }
}
