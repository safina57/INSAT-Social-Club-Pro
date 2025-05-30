import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobInput } from './dto/create-job.input';

@Injectable()
export class JobService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateJobInput, userId: string) {
    return this.prisma.job.create({
      data: {
        ...input,
        postedById: userId,
      },
    });
  }

  findAll() {
    return this.prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findByCompany(companyId: string) {
    return this.prisma.job.findMany({
      where: { companyId },
    });
  }

  findOne(id: string) {
    return this.prisma.job.findUnique({ where: { id } });
  }
}
