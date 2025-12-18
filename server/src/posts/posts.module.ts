import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './posts.schema';
import { PostService } from './posts.service';
import { PostsController } from './posts.controller';
import { User, UserSchema } from 'src/users/users.schema';

@Module({
  imports: [
    //DB collection 등록
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostService],
  exports: [PostService], // 다른 모듈에서 쓰기위해 내보내기
})
export class PostsModule {}
