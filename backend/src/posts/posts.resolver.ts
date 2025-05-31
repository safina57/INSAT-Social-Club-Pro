import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { PostsService } from './posts.service';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @Args({ name: 'image', type: () => GraphQLUpload, nullable: true })
    image: FileUpload | null,

    @GetUser() user: User,
  ) {
    return this.postsService.createPost(createPostInput, image, user.id);
  }

  @Query(() => [Post], { name: 'posts' })
  findAll() {
    return this.postsService.findAll();
  }

  @Mutation(() => Post)
  updatePost(
    @Args('id', { type: () => ID }) id: string,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @GetUser() user: User,
  ) {
    return this.postsService.updatePost(id, updatePostInput, user.id);
  }

  @Mutation(() => Post)
  removePost(
    @Args('id', { type: () => ID }) id: string,
    @GetUser() user: User,
  ) {
    return this.postsService.removePost(id, user);
  }

  @Mutation(() => Post)
  likePost(@Args('id', { type: () => ID }) id: string, @GetUser() user: User) {
    return this.postsService.likePost(id, user.id);
  }

  @Mutation(() => Post)
  unlikePost(
    @Args('id', { type: () => ID }) id: string,
    @GetUser() user: User,
  ) {
    return this.postsService.unlikePost(id, user.id);
  }
}
