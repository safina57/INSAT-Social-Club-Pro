import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ID,
} from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { CompanyType } from './entities/company.type';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@Resolver(() => CompanyType)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JWTAuthGuard)
  @Mutation(() => CompanyType)
  createCompany(
    @Args('input') input: CreateCompanyInput,
    @GetUser() user: User,
  ) {
    return this.companyService.create(input, user.id);
  }

  @Public()
  @Query(() => [CompanyType])
  Companies() {
    return this.companyService.findAll();
  }

  @Public()
  @Query(() => CompanyType)
  Company(@Args('id', { type: () => ID }) id: string) {
    return this.companyService.findOne(id);
  }

  @UseGuards(JWTAuthGuard)
  @Mutation(() => CompanyType)
  updateCompany(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateCompanyInput,
    @GetUser() user: User,
  ) {
    return this.companyService.update(id, input, user.id);
  }

  @UseGuards(JWTAuthGuard)
  @Mutation(() => CompanyType)
  removeCompany(
    @Args('id', { type: () => ID }) id: string,
    @GetUser() user: User,
  ) {
    return this.companyService.remove(id, user.id);
  }
}
