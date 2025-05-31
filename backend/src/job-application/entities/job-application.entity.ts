import { Field, ID, ObjectType } from "@nestjs/graphql";
import { ApplicationStatus } from "../enum/application-status.enum";

@ObjectType()
export class JobApplication {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  jobId: string;

  @Field()
  createdAt: Date;

  @Field(() => ApplicationStatus)
  status: ApplicationStatus;

  @Field({ nullable: true })
  decidedAt?: Date;
}
