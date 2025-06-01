import { Module } from '@nestjs/common';
import { ContactReportsService } from './contact-reports.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailerModule } from '../mailer/mailer.module';
import { ContactReportsController } from './contact-reports.controller';

@Module({
  imports: [MailerModule],
  providers: [ContactReportsService, PrismaService],
  controllers: [ContactReportsController],
})
export class ContactReportsModule {}