import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive } from 'class-validator';

@InputType()
export class PaginationDto {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsPositive()
  page?: number = 1;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsPositive()
  limit?: number = 10;
}
