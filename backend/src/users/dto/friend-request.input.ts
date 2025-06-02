import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class FriendRequestInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => ID)
  friendId: string;
}
