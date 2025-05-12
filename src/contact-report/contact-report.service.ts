import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactReportInput } from './dto/create-contact-report.input';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class ContactReportService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  async createContactReport(input: CreateContactReportInput) {
    const report = await this.prisma.contactReport.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        message: input.message,
      },
    });

    // Send email notification to admin
    await this.sendEmailNotification(report);

    return report;
  }

  async findAll() {
    return this.prisma.contactReport.findMany();
  }

  async findOne(id: string) {
    return this.prisma.contactReport.findUnique({
      where: { id },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.contactReport.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private async sendEmailNotification(report: any) {
    await this.mailerService.sendMail(
      'admin@insatsocialclub.com',
      'New Contact Us Message',
      `
        <h3>New Contact Us Message</h3>
        <p><strong>Report ID:</strong> ${report.id}</p>
        <p><strong>Name:</strong> ${report.fullName}</p>
        <p><strong>Email:</strong> ${report.email}</p>
        <p><strong>Message:</strong> ${report.message}</p>
        <p>Click <a href="http://your-app-url/admin/reports/${report.id}">here</a> to read the full content.</p>
      `,
    );
  }
}