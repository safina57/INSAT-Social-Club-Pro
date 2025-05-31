import { InputType, Field } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateJobInput {
  @IsString()
  @Field()
  title: string;

  @IsString()
  @Field()
  description: string;

  @IsString()
  @Field({ nullable: true })
  location?: string;

  @IsNumber()
  @IsOptional()
  @Field({ nullable: true })
  salary?: number;

  @IsString()
  @Field()
  companyId: string;
}
