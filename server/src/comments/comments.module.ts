import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema, Comment } from './comments.schema';
import { CommentService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Post, PostSchema } from '../posts/posts.schema';
import { User, UserSchema } from '../users/users.schema';

@Module({
  imports: [
    //DB collection 등록
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentService],
  exports: [CommentService], // 다른 모듈에서 쓰기위해 내보내기
})
export class CommentsModule {}
