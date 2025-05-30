import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto, userId: string) {
    const company = await this.prisma.company.create({
      data: {
        ...createCompanyDto,
        managers: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
    });
    return company;
  }

  async findAll() {
    return this.prisma.company.findMany();
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { managers: true, jobs: true },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, userId: string) {
    // Check if user is an ADMIN of the company
    const manager = await this.prisma.companyManager.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId: id,
        },
      },
    });
    if (!manager) {
      throw new ForbiddenException('You do not have permission to update this company');
    }

    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

async addManager(companyId: string, managerId: string, userId: string) {
  const manager = await this.prisma.companyManager.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  if (!manager || manager.role !== 'ADMIN') {
    throw new ForbiddenException('You do not have permission to add managers to this company');
  }

  const userToAssign = await this.prisma.user.findUnique({
    where: { id: managerId },
  });

  if (!userToAssign) {
    throw new NotFoundException('User to assign as manager not found');
  }

  const existingManager = await this.prisma.companyManager.findUnique({
    where: {
      userId_companyId: {
        userId: managerId,
        companyId,
      },
    },
  });

  if (existingManager) {
    throw new ConflictException('User is already a manager of this company');
  }

  const newManager = await this.prisma.companyManager.create({
    data: {
      userId: managerId,
      companyId: companyId,
      role: 'EDITOR',
    },
  });

  return newManager;
}


  async remove(id: string, userId: string) {
    // Only ADMIN can delete
    const manager = await this.prisma.companyManager.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId: id,
        },
      },
    });
    if (!manager || manager.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to delete this company');
    }

    return this.prisma.company.delete({
      where: { id },
    });
  }
}
