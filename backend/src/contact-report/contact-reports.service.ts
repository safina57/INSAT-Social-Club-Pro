import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { CreateContactReportDto } from './dto/create-contact-report.dto';
import { ContactReport } from './entities/contact-report.entity';
import { UpdateContactReportDto } from './dto/update-contact-report.dto';
import { FilterContactReportsDto } from './dto/contact-report-filer.dto';
import { paginate } from 'src/common/utils/paginate';

@Injectable()
export class ContactReportsService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async create(
    createContactReportInput: CreateContactReportDto,
  ): Promise<ContactReport> {
    const contactReport = await this.prisma.contactReport.create({
      data: createContactReportInput,
    });
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');

    if (!adminEmail) {
      console.error(
        'ADMIN_EMAIL is not defined in environment variables. Skipping email notification.',
      );
    } else {
      try {
        await this.mailerService.sendMail(
          adminEmail,
          'New Contact Report Submitted',
          `<p>Dear Admin,</p><p>A new contact report has been submitted.</p><p>Report ID: ${contactReport.id}</p><p>Submitted by: ${contactReport.fullName} (${contactReport.email})</p><p>Please log in to the admin dashboard to view the full message.</p><p>Best regards,<br>INSAT Social Club Pro Team</p>`,
        );
      } catch (error) {
        console.error(
          'Failed to send email notification:',
          error.message,
          error.stack,
        );
      }
    }

    return contactReport;
  }

  async findAll(filter: FilterContactReportsDto) {
    const { page = 1, limit = 10, status, category, searchTerm } = filter;
    const where: any = {};
    if (status && status !== 'all') where.status = status;
    if (category && category !== 'all') where.category = category;
    if (searchTerm) {
      where.OR = [{ subject: { contains: searchTerm, mode: 'insensitive' } }];
    }
    return paginate<ContactReport>(this.prisma.contactReport, {
      page,
      limit,
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStatistics() {
    const [total, pending, beingTreated, treated] = await Promise.all([
      this.prisma.contactReport.count(),
      this.prisma.contactReport.count({ where: { status: 'Pending' } }),
      this.prisma.contactReport.count({ where: { status: 'Being_Treated' } }),
      this.prisma.contactReport.count({ where: { status: 'Treated' } }),
    ]);
    return { total, pending, beingTreated, treated };
  }

  async deleteContactReport(id: string): Promise<void> {
    await this.prisma.contactReport.delete({
      where: { id },
    });
  }

  async updateContactReport(
    id: string,
    updateContactReportInput: UpdateContactReportDto,
  ): Promise<ContactReport> {
    return this.prisma.contactReport.update({
      where: { id },
      data: updateContactReportInput,
    });
  }
}
