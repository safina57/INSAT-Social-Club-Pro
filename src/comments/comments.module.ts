import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [CommentsResolver, CommentsService, UsersService],
})
export class CommentsModule {}
