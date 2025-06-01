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
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sgMail = require("@sendgrid/mail");
let MailerService = class MailerService {
    configService;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('SENDGRID_API_KEY');
        if (!apiKey) {
            throw new Error('SENDGRID_API_KEY is not defined');
        }
        sgMail.setApiKey(apiKey);
    }
    async sendMail(to, subject, html) {
        const fromEmail = this.configService.get('SENDGRID_FROM_EMAIL');
        if (!fromEmail) {
            throw new Error('SENDGRID_FROM_EMAIL is not defined');
        }
        const msg = {
            to,
            from: fromEmail,
            subject,
            html,
        };
        try {
            await sgMail.send(msg);
            console.log('Email sent successfully');
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailerService);
//# sourceMappingURL=mailer.service.js.map