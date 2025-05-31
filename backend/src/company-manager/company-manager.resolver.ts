import {
  Resolver,
  Mutation,
  Args,
  ID,
  Query,
} from '@nestjs/graphql';
import { CompanyManagerService } from './company-manager.service';
import { CreateCompanyManagerInput } from './dto/create-company-manager.input';
import { CompanyManagerType } from './entities/company-manager.type';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@Resolver(() => CompanyManagerType)
@UseGuards(JWTAuthGuard)
export class CompanyManagerResolver {
  constructor(private readonly companyManagerService: CompanyManagerService) {}

  @Mutation(() => CompanyManagerType)
  addManager(
    @Args('input') input: CreateCompanyManagerInput,
    @GetUser() user: User,
  ) {
    return this.companyManagerService.addManager(
      input.userId,
      input.companyId,
      input.role,
      user.id,
    );
  }

  @Mutation(() => Boolean)
  removeManager(
    @Args('companyId', { type: () => ID }) companyId: string,
    @Args('managerId', { type: () => ID }) managerId: string,
    @GetUser() user: User,
  ) {
    return this.companyManagerService.removeManager(
      managerId,
      companyId,
      user.id,
    );
  }

  @Query(() => [CompanyManagerType])
  listManagers(@Args('companyId', { type: () => ID }) companyId: string) {
    return this.companyManagerService.listManagers(companyId);
  }
}
