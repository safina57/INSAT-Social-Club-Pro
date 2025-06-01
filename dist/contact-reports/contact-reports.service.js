"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mailer_service_1 = require("../mailer/mailer.service");
const config_1 = require("@nestjs/config");
let ContactReportsService = class ContactReportsService {
    prisma;
    mailerService;
    configService;
    constructor(prisma, mailerService, configService) {
        this.prisma = prisma;
        this.mailerService = mailerService;
        this.configService = configService;
    }
    async create(createContactReportInput) {
        const contactReport = await this.prisma.contactReport.create({ data: createContactReportInput });
        const adminEmail = this.configService.get('ADMIN_EMAIL');
        if (!adminEmail) {
            console.error('ADMIN_EMAIL is not defined in environment variables. Skipping email notification.');
        }
        else {
            try {
                await this.mailerService.sendMail(adminEmail, 'New Contact Report Submitted', `<p>Dear Admin,</p><p>A new contact report has been submitted.</p><p>Report ID: ${contactReport.id}</p><p>Submitted by: ${contactReport.fullName} (${contactReport.email})</p><p>Please log in to the admin dashboard to view the full message.</p><p>Best regards,<br>INSAT Social Club Pro Team</p>`);
            }
            catch (error) {
                console.error('Failed to send email notification:', error.message, error.stack);
            }
        }
        return contactReport;
    }
    async findAll() {
        return this.prisma.contactReport.findMany();
    }
};
exports.ContactReportsService = ContactReportsService;
exports.ContactReportsService = ContactReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mailer_service_1.MailerService,
        config_1.ConfigService])
], ContactReportsService);
//# sourceMappingURL=contact-reports.service.js.map