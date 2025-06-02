import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User, Role } from '@prisma/client';
import { filter, fromEventPattern, map, Observable } from 'rxjs';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { eventsPatterns } from 'src/common/events/events.patterns';

@Controller('notification')
export class NotificationController {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  @Sse('events')
  sse(@GetUser() user: User): Observable<{ data: any; type?: string }> {
    const eventNames = Object.values(eventsPatterns);

    return fromEventPattern(
      (handler) => {
        for (const eventName of eventNames) {
          this.eventEmitter.on(eventName, handler);
        }
      },
      (handler) => {
        for (const eventName of eventNames) {
          this.eventEmitter.off(eventName, handler);
        }
      },
    ).pipe(
      filter((event: any) => {
        return (
          user?.role === Role.ADMIN ||
          (event.userId === user?.id && event.fromUserId !== user?.id)
        );
      }),
      map((event: any) => {
        const eventType = event.type;
        return new MessageEvent(eventType, { data: event });
      }),
    );
  }
}
