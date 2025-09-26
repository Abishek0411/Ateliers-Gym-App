import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { AuthModule } from '../auth/auth.module';
import { Post, PostSchema } from './schemas/post.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService],
  exports: [CommunityService],
})
export class CommunityModule {}
