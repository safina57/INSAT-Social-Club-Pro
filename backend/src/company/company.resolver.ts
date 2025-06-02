import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { CompanyType } from './entities/company.type';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Paginated } from 'src/common/factories/paginated.factory';

const paginatedCompanies = Paginated(CompanyType);

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

  @Query(() => Boolean)
  isAdmin(@GetUser() user: User,
  @Args('id', { type: () => ID }) id: string){
    return this.companyService.isAdmin(user.id, id);
  }

  @Public()
  @Query(() => paginatedCompanies)
  Companies(
    @Args('paginationDto', { type: () => PaginationDto, nullable: true })
    paginationDto?: PaginationDto,
  ) {
    return this.companyService.findAll(paginationDto ?? {});
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
