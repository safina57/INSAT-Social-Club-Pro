import { Status } from '@prisma/client';
import { CreateContactReportDto } from './create-contact-report.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
export class UpdateContactReportDto extends PartialType(CreateContactReportDto) {
  @IsEnum(Status)
  status?: Status; 
}