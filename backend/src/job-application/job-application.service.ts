import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ApplicationStatus } from "./dto/enum/application-status.enum";

@Injectable()
export class JobApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async apply(jobId: string, userId: string) {
    const existing = await this.prisma.jobApplication.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });

    if (existing) {
      throw new ConflictException('Already applied to this job.');
    }

    return this.prisma.jobApplication.create({
      data: {
        job: { connect: { id: jobId } },
        user: { connect: { id: userId } },
      },
    });
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

  async changeStatus(applicationId: string, status: ApplicationStatus, managerId: string) {
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

  return this.prisma.jobApplication.update({
    where: { id: applicationId },
    data: {
      status,
      decidedAt: new Date(),
    },
  });
}

}
