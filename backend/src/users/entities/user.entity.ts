import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '../enums/role.enum';
import { Comment } from '../../comments/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => Role)
  role: Role;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  accessToken?: string | null;

  @Field(() => String, { nullable: true })
  verificationToken?: string | null;

  @Field(() => Boolean)
  isVerified: boolean;

  @Field(() => String, { nullable: true })
  resetPasswordToken?: string | null;

  @Field(() => [Post], { nullable: true })
  posts?: Post[] | null;

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[] | null;

  @Field(() => [User], { nullable: true })
  friends?: User[] | null;

  @Field(() => String, { nullable: true })
  profilePhoto?: string | null;
}
