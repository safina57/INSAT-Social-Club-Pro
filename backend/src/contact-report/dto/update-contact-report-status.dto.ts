import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateContactReportStatusDto {
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}