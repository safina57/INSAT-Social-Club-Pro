import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Author } from 'src/users/entities/author.entity';

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  content: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Author)
  author: Author;

  @Field(() => String)
  authorId: string;
}
