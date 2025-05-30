import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from './config-schema';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { JobModule } from './job/job.module';
import { CompanyModule } from './company/company.module';
import { CompanyManagerModule } from './company-manager/company-maanger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: configSchema,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    JobModule,
    CompanyModule,
    CompanyManagerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
