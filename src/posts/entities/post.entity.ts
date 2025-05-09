import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Comment } from '../../comments/entities/comment.entity';
import { Author } from 'src/users/entities/author.entity';

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

  @Field(() => Number)
  likesCount: number;

  @Field(() => Author)
  author: Author;

  @Field(() => String)
  authorId: string;

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[] | null;
}
