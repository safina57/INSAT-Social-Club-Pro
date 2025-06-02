import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';
import { FriendRequestStatus } from '../enums/friend-request-status.enum';

@ObjectType()
export class FriendRequest {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  senderId: string;

  @Field(() => String)
  receiverId: string;

  @Field(() => FriendRequestStatus)
  status: FriendRequestStatus;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => User)
  sender: User;

  @Field(() => User)
  receiver: User;
}
