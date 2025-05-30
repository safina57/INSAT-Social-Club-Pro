import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [PostsResolver, PostsService, UsersService],
})
export class PostsModule {}
