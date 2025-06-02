import { Controller, Post, Get, Body, Delete, Put, Query, Param } from '@nestjs/common';
import { ContactReportsService } from './contact-reports.service';
import { CreateContactReportDto } from './dto/create-contact-report.dto';
import { ContactReport } from './entities/contact-report.entity';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { UpdateContactReportDto } from './dto/update-contact-report.dto';
import { FilterContactReportsDto } from './dto/contact-report-filer.dto';
import { PaginatedContactReportsDto } from './entities/paginated-contact-report.entity';


@Controller('contact-reports')
export class ContactReportsController {
  constructor(private contactReportsService: ContactReportsService) {}
  @Public()
  @Post()
  async createContactReport(@Body() input: CreateContactReportDto): Promise<ContactReport> {
    return this.contactReportsService.create(input);
  }

  @Roles(Role.ADMIN)
  @Get()
  async getContactReports(@Query() filter: FilterContactReportsDto): Promise<PaginatedContactReportsDto> {
    return this.contactReportsService.findAll(filter);
  }

  @Roles(Role.ADMIN)
  @Get('stats')
  async getContactReportStats(): Promise<any> {
    return this.contactReportsService.getStatistics();
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteContactReport(@Param('id') id: string): Promise<void> {
    return this.contactReportsService.deleteContactReport(id);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async updateContactReport(
    @Param('id') id: string,
    @Body() updateContactReportInput: UpdateContactReportDto,
  ): Promise<ContactReport> {
    return this.contactReportsService.updateContactReport(id, updateContactReportInput);
  }
}
