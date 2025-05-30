import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ContactReportsService } from './contact-reports.service';
import { CreateContactReportInput } from './dto/create-contact-report.input';
import { ContactReport } from './entities/contact-report.entity';
import { Public } from '../auth/decorators/public.decorator';

@Resolver(() => ContactReport)
export class ContactReportsResolver {
  constructor(private contactReportsService: ContactReportsService) {}

  @Mutation(() => ContactReport)
  @Public()
  async createContactReport(@Args('input') input: CreateContactReportInput) {
    return this.contactReportsService.create(input);
  }

  @Query(() => [ContactReport], { name: 'contactReports' })
  async getContactReports() {
    return this.contactReportsService.findAll();
  }
}