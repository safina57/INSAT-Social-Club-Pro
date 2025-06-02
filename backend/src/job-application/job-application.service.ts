import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApplicationStatus } from './enum/application-status.enum';
import { eventsPatterns } from 'src/common/events/events.patterns';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class JobApplicationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async apply(jobId: string, userId: string) {
    const existing = await this.prisma.jobApplication.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });

    if (existing) {
      throw new ConflictException('Already applied to this job.');
    }
    const application = await this.prisma.jobApplication.create({
      data: {
        job: { connect: { id: jobId } },
        user: { connect: { id: userId } },
      },
      include: {
        job: {
          select: {
            title: true,
            companyId: true,
          },
        },
      },
    });

    const managers = await this.prisma.companyManager.findMany({
      where: { companyId: application.job.companyId },
      include: { user: true },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { username: true },
    });
    for (const manager of managers) {
      this.eventEmitter.emit(eventsPatterns.NEW_JOB_APPLICATION, {
        type: eventsPatterns.NEW_JOB_APPLICATION,
        userId: manager.userId,
        fromUserId: userId,
        senderName: user?.username,
        jobId: jobId,
        applicationId: application.id,
        message: `submitted an application to your job`,
      });
    }

    return application;
  }

  getApplicationsByUser(userId: string) {
    return this.prisma.jobApplication.findMany({
      where: { userId },
      include: { job: true },
    });
  }

  getApplicantsForJob(jobId: string) {
    return this.prisma.jobApplication.findMany({
      where: { jobId },
      include: { user: true },
    });
  }

  async changeStatus(
    applicationId: string,
    status: ApplicationStatus,
    managerId: string,
  ) {
    const application = await this.prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application) throw new NotFoundException('Application not found');

    // Check if manager is authorized
    const isManager = await this.prisma.companyManager.findUnique({
      where: {
        userId_companyId: {
          userId: managerId,
          companyId: application.job.companyId,
        },
      },
    });

    if (!isManager) {
      throw new ForbiddenException('You are not a manager of this company');
    }

    const updatedApplication = await this.prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        status,
        decidedAt: new Date(),
      },
    });

    this.eventEmitter.emit(eventsPatterns.APPLICATION_STATUS_CHANGED, {
      type: eventsPatterns.APPLICATION_STATUS_CHANGED,
      userId: application.userId,
      fromUserId: managerId,
      applicationId: application.id,
      jobId: application.job.id,
      status,
      message: `Your application for job "${application.job.title}" was ${status.toLowerCase()} by a manager.`,
    });

    return updatedApplication;
  }
}
