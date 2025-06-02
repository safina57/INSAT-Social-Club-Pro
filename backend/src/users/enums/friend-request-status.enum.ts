import { registerEnumType } from '@nestjs/graphql';

export enum FriendRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

registerEnumType(FriendRequestStatus, {
  name: 'FriendRequestStatus',
  description: 'Friend request status',
});
