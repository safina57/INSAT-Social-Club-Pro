import { Module } from '@nestjs/common';
import { ContactReportService } from './contact-report.service';
import { ContactReportResolver } from './contact-report.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [PrismaModule, MailerModule],
  providers: [ContactReportService, ContactReportResolver],
})
export class ContactReportModule {}