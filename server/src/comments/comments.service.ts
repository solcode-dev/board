import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comments.schema';
import { Post } from '../posts/posts.schema';
import { User } from '../users/users.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  //댓글쓰기
  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const { content, postId } = createCommentDto;
    const author = await this.userModel
      .findById(userId)
      .select('username')
      .exec();

    const createComment = new this.commentModel({
      content,
      author,
      post: postId, // 게시글 연결
    });
    // 실제 MongoDB에 저장
    return createComment.save();
  }

  // 댓글 조회
  async findAll(postId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ post: postId })
      .populate('author', 'username') // 작성자 정보 가져오기
      .exec();
  }

  // 삭제
  async delete(id: string, userId: string): Promise<void> {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }

    // 작성자 확인
    if (comment.author.toString() !== userId) {
      throw new UnauthorizedException('작성자만 삭제할 수 있습니다.');
    }

    await this.commentModel.findByIdAndDelete(id).exec();
  }
}
