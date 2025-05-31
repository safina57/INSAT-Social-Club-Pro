import { Module } from '@nestjs/common';
import { CompanyManagerService } from './company-manager.service';
import { CompanyManagerController } from './company-manager.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CompanyManagerController],
  providers: [CompanyManagerService, PrismaService],
})
export class CompanyManagerModule {}
