import { Module } from '@nestjs/common';
import { CompanyManagerService } from './company-manager.service';
import { CompanyManagerResolver } from './company-manager.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [CompanyManagerResolver, CompanyManagerService, PrismaService],
})
export class CompanyManagerModule {}
