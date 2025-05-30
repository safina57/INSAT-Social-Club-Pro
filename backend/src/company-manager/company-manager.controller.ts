import { Controller, Post, Body, Delete, Param, Req, UseGuards, Get } from '@nestjs/common';
import { CompanyManagerService } from './company-manager.service';
import { CreateCompanyManagerDto } from './dto/create-company-manager.dto';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('company-managers')
@UseGuards(JWTAuthGuard)
export class CompanyManagerController {
  constructor(private readonly companyManagerService: CompanyManagerService) {}

  @Post()
  addManager(@Body() dto: CreateCompanyManagerDto, @Req() req) {
    return this.companyManagerService.addManager(dto.userId, dto.companyId, dto.role, req.user.id);
  }

  @Delete(':companyId/:userId')
  removeManager(@Param('companyId') companyId: string, @Param('userId') userId: string, @Req() req) {
    return this.companyManagerService.removeManager(userId, companyId, req.user.id);
  }

  @Get(':companyId')
  listManagers(@Param('companyId') companyId: string) {
    return this.companyManagerService.listManagers(companyId);
  }
}
