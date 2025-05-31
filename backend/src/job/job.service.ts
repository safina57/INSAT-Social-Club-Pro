import { PrismaService } from "src/prisma/prisma.service";
import { CreateJobInput } from "./dto/create-job.input";
import { Injectable } from "@nestjs/common";
import { paginate } from "src/common/utils/paginate";
import { PaginationDto } from "src/common/dto/pagination.dto";

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

  findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto ?? {};
    return paginate(this.prisma.job, {
        page,
        limit,
        orderBy: { createdAt: 'desc' }, 
      });
  }

  findOne(id: string) {
    return this.prisma.job.findUnique({ where: { id } });
  }

  findByCompany(companyId: string, paginationDto?: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto ?? {};
    return paginate(this.prisma.job, {
      where: { companyId },
      page,
      limit,
      orderBy: { createdAt: 'desc' },
    });
  }
}
