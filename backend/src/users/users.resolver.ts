import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Paginated } from 'src/common/factories/paginated.factory';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { GraphQLUpload, FileUpload } from 'graphql-upload';


const PaginatedUsers = Paginated(User);
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => User, {name: 'currentuser'})
  getCurrentUser(
  @GetUser() user: User ) {
    return this.usersService.getCurrentUser(user.id);
  }

  @Roles(Role.ADMIN)
  @Query(() => PaginatedUsers, { name: 'users' })
  findAll(
    @Args('paginationDto', { type: () => PaginationDto, nullable: true }) paginationDto?: PaginationDto,
  ) {
    return this.usersService.findAll(paginationDto?? { page: 1, limit: 10 });
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.remove(id);
  }
  @Mutation(() => User)
  addFriend(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('friendId', { type: () => ID }) friendId: string,
  ) {
    return this.usersService.addFriend(userId, friendId);
  }
  @Mutation(() => User)
  async uploadProfilePhoto(
    @GetUser() user: User,
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<User> {
    return this.usersService.updateProfilePhoto(user.id, file);
  }
  
}
