import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { User } from '@prisma/client';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JWTAuthGuard)
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @GetUser() user: User) {
    return this.companyService.create(createCompanyDto, user.id);
  }

  @Public()
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @UseGuards(JWTAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @GetUser() user: User) {
    return this.companyService.update(id, updateCompanyDto, user.id);
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.companyService.remove(id, user.id);
  }
}
