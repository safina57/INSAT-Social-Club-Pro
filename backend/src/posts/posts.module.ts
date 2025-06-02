import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { UsersService } from 'src/users/users.service';
import { ImageUploadModule } from 'src/image-upload/image-upload.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ImageUploadModule, UsersModule],
  providers: [PostsResolver, PostsService, UsersService],
})
export class PostsModule {}
