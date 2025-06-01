"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactReportsModule = void 0;
const common_1 = require("@nestjs/common");
const contact_reports_service_1 = require("./contact-reports.service");
const contact_reports_resolver_1 = require("./contact-reports.resolver");
const prisma_service_1 = require("../prisma/prisma.service");
const mailer_module_1 = require("../mailer/mailer.module");
let ContactReportsModule = class ContactReportsModule {
};
exports.ContactReportsModule = ContactReportsModule;
exports.ContactReportsModule = ContactReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [mailer_module_1.MailerModule],
        providers: [contact_reports_service_1.ContactReportsService, contact_reports_resolver_1.ContactReportsResolver, prisma_service_1.PrismaService],
    })
], ContactReportsModule);
//# sourceMappingURL=contact-reports.module.js.map