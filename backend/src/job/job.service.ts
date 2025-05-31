import { PrismaService } from "src/prisma/prisma.service";
import { CreateJobInput } from "./dto/create-job.input";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JobService {
  constructor(private readonly prisma: PrismaService) {}

  create(createJobInput: CreateJobInput, userId: string) {
    return this.prisma.job.create({
      data: {
        ...createJobInput
          },
    });
  }

  findAll() {
    return this.prisma.job.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string) {
    return this.prisma.job.findUnique({ where: { id } });
  }

  findByCompany(companyId: string) {
    return this.prisma.job.findMany({ where: { companyId } });
  }
}
