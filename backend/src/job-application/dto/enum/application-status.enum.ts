import { registerEnumType } from '@nestjs/graphql';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

registerEnumType(ApplicationStatus, {
  name: 'ApplicationStatus',
});
