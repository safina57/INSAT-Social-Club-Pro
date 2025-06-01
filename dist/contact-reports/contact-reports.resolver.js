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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactReportsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const contact_reports_service_1 = require("./contact-reports.service");
const create_contact_report_input_1 = require("./dto/create-contact-report.input");
const contact_report_entity_1 = require("./entities/contact-report.entity");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let ContactReportsResolver = class ContactReportsResolver {
    contactReportsService;
    constructor(contactReportsService) {
        this.contactReportsService = contactReportsService;
    }
    async createContactReport(input) {
        return this.contactReportsService.create(input);
    }
    async getContactReports() {
        return this.contactReportsService.findAll();
    }
};
exports.ContactReportsResolver = ContactReportsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => contact_report_entity_1.ContactReport),
    (0, public_decorator_1.Public)(),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contact_report_input_1.CreateContactReportInput]),
    __metadata("design:returntype", Promise)
], ContactReportsResolver.prototype, "createContactReport", null);
__decorate([
    (0, graphql_1.Query)(() => [contact_report_entity_1.ContactReport], { name: 'contactReports' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContactReportsResolver.prototype, "getContactReports", null);
exports.ContactReportsResolver = ContactReportsResolver = __decorate([
    (0, graphql_1.Resolver)(() => contact_report_entity_1.ContactReport),
    __metadata("design:paramtypes", [contact_reports_service_1.ContactReportsService])
], ContactReportsResolver);
//# sourceMappingURL=contact-reports.resolver.js.map