import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ImageUploadModule } from '../image-upload/image-upload.module';

@Module({
  imports: [
    PrismaModule,       
    ImageUploadModule, 
  ],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
