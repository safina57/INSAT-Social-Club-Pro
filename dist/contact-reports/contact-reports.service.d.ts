import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { CreateContactReportInput } from './dto/create-contact-report.input';
import { ContactReport } from './entities/contact-report.entity';
export declare class ContactReportsService {
    private prisma;
    private mailerService;
    private configService;
    constructor(prisma: PrismaService, mailerService: MailerService, configService: ConfigService);
    create(createContactReportInput: CreateContactReportInput): Promise<ContactReport>;
    findAll(): Promise<ContactReport[]>;
}
