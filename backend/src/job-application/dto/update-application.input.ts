import { InputType, Field } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { ApplicationStatus } from '../enum/application-status.enum';

@InputType()
export class UpdateApplicationInput {
  @IsEnum(ApplicationStatus)
  @Field()
  status: ApplicationStatus;
}
