import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JWTAuthGuard)
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @Req() req) {
    return this.companyService.create(createCompanyDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @UseGuards(JWTAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @Req() req) {
    return this.companyService.update(id, updateCompanyDto, req.user.id);
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.companyService.remove(id, req.user.id);
  }
}
