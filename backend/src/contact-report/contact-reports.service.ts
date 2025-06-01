import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { CreateContactReportDto } from './dto/create-contact-report.dto';
import { ContactReport } from './entities/contact-report.entity';

@Injectable()
export class ContactReportsService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async create(createContactReportInput: CreateContactReportDto): Promise<ContactReport> {
    const contactReport = await this.prisma.contactReport.create({ data: createContactReportInput });
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');

    if (!adminEmail) {
      console.error('ADMIN_EMAIL is not defined in environment variables. Skipping email notification.');
    } else {
      try {
        await this.mailerService.sendMail(
          adminEmail,
          'New Contact Report Submitted',
          `<p>Dear Admin,</p><p>A new contact report has been submitted.</p><p>Report ID: ${contactReport.id}</p><p>Submitted by: ${contactReport.fullName} (${contactReport.email})</p><p>Please log in to the admin dashboard to view the full message.</p><p>Best regards,<br>INSAT Social Club Pro Team</p>`
        );
      } catch (error) {
        console.error('Failed to send email notification:', error.message, error.stack);
      }
    }

    return contactReport;
  }

  async findAll(): Promise<ContactReport[]> {
    return this.prisma.contactReport.findMany();
  }

  async deleteContactReport(id: number): Promise<void> {
    await this.prisma.contactReport.delete({
      where: { id },
    });
  }
}