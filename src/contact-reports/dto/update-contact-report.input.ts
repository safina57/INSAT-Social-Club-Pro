import { CreateContactReportInput } from './create-contact-report.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateContactReportInput extends PartialType(CreateContactReportInput) {
  @Field(() => Int)
  id: number;
}
