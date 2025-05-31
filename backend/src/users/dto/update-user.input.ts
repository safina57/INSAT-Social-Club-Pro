import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsString()
  @IsNotEmpty()
  @Field(() => ID)
  id: string;
  @Field(() => String, { nullable: true })
  profilePhoto?: string; 
}
