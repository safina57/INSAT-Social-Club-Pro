import { Resolver, Mutation, Args, ID } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @GetUser() user: User,
  ) {
    return this.commentsService.createComment(createCommentInput, user.id);
  }

  @Mutation(() => Comment)
  updateComment(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @GetUser() user: User,
  ) {
    return this.commentsService.updateComment(id, updateCommentInput, user.id);
  }

  @Mutation(() => Comment)
  removeComment(
    @Args('id', { type: () => ID }) id: string,
    @GetUser() user: User,
  ) {
    return this.commentsService.removeComment(id, user);
  }
}
