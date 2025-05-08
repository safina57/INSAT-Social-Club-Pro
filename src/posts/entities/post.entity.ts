import { ObjectType, Field, ID, PickType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
// import { Comment } from '../../comments/entities/comment.entity';

@ObjectType()
export class PostAuthor extends PickType(User, ['username'] as const) {}

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  content: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => PostAuthor)
  author: PostAuthor;

  @Field(() => String)
  authorId: string;

  // @Field(() => [Comment])
  // comments?: Comment[];
}
