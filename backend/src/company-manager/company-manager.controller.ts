import { Controller, Post, Body, Delete, Param, UseGuards, Get } from '@nestjs/common';
import { CompanyManagerService } from './company-manager.service';
import { CreateCompanyManagerDto } from './dto/create-company-manager.dto';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@Controller('company-managers')
@UseGuards(JWTAuthGuard)
export class CompanyManagerController {
  constructor(private readonly companyManagerService: CompanyManagerService) {}

  @Post()
  addManager(@Body() dto: CreateCompanyManagerDto, @GetUser() user: User) {
    return this.companyManagerService.addManager(dto.userId, dto.companyId, dto.role, user.id);
  }

  @Delete(':companyId/:managerId')
  removeManager(@Param('companyId') companyId: string, @Param('managerId') managerId: string, @GetUser() user: User ) {
    return this.companyManagerService.removeManager(managerId, companyId, user.id);
  }

  @Get(':companyId')
  listManagers(@Param('companyId') companyId: string) {
    return this.companyManagerService.listManagers(companyId);
  }
}

