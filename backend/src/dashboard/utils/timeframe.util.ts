import { TimeFrame } from '../enums/timeframe.enum';

export class TimeFrameUtil {
  static getConfig(timeFrame: TimeFrame) {
    switch (timeFrame) {
      case TimeFrame.DAY:
        return { format: 'YYYY-MM-DD', limit: 30, interval: '30 days' };
      case TimeFrame.WEEK:
        return { format: 'YYYY-"W"WW', limit: 12, interval: '12 weeks' };
      case TimeFrame.MONTH:
        return { format: 'YYYY-MM', limit: 12, interval: '12 months' };
    }
  }
}
