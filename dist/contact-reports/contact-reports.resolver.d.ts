import { ContactReportsService } from './contact-reports.service';
import { CreateContactReportInput } from './dto/create-contact-report.input';
import { ContactReport } from './entities/contact-report.entity';
export declare class ContactReportsResolver {
    private contactReportsService;
    constructor(contactReportsService: ContactReportsService);
    createContactReport(input: CreateContactReportInput): Promise<ContactReport>;
    getContactReports(): Promise<ContactReport[]>;
}
