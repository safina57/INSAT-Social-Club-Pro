import { registerEnumType } from "@nestjs/graphql";

export enum ManagerRole {
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN',
}

registerEnumType(ManagerRole, {
  name: 'ManagerRole',
});