import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyResolver } from './company.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [CompanyResolver, CompanyService, PrismaService],
})
export class CompanyModule {}
