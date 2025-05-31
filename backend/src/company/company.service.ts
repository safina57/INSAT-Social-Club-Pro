import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { ManagerRole } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyInput, userId: string) {
    const company = await this.prisma.company.create({
      data: {
        ...createCompanyDto,
        managers: {
          create: {
            userId,
            role: ManagerRole.ADMIN,
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

  async update(id: string, updateCompanyDto: UpdateCompanyInput, userId: string) {
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
