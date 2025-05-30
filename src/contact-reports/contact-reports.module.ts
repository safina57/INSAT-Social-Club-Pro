import { Module } from '@nestjs/common';
import { ContactReportsService } from './contact-reports.service';
import { ContactReportsResolver } from './contact-reports.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [MailerModule],
  providers: [ContactReportsService, ContactReportsResolver, PrismaService],
})
export class ContactReportsModule {}