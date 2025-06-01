import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TimeFrameUtil } from './timeframe.util';
import { TimeFrame } from '../enums/timeframe.enum';

export class RawDataUtil {
  static async getDataPerTimeFrame(
    prisma: PrismaService, 
    timeFrame: TimeFrame,
    tableName: string
  ) {
    const { format, limit, interval } = TimeFrameUtil.getConfig(timeFrame);

    return prisma.$queryRaw<{ date: string; count: number }[]>(Prisma.sql`
        SELECT 
        TO_CHAR("createdAt", ${format}) AS date,
        COUNT(*)::int AS count
        FROM ${Prisma.raw(`"${tableName}"`)}
        WHERE "createdAt" >= NOW() - INTERVAL '${Prisma.raw(interval)}'
        GROUP BY date
        ORDER BY date DESC
        LIMIT ${limit}
    `);
  }

  // Helper methods for convenience
  static async getUserSignups(prisma: PrismaService, timeFrame: TimeFrame) {
    return this.getDataPerTimeFrame(prisma, timeFrame, 'User');
  }

  static async getPostsPerTimeFrame(prisma: PrismaService, timeFrame: TimeFrame) {
    return this.getDataPerTimeFrame(prisma, timeFrame, 'Post');
  }
}
