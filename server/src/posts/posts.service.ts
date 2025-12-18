import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './posts.schema';
import { User } from '../users/users.schema';

@Injectable()
export class PostService {
  // "이 클래스를 다른 곳에서 쓸 수 있게 해줘"
  //1. DB모델 준비
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {} // 이 서비스가 실행될 때 DB를 다룰 수 있는 도구(Model)를 챙겨줘

  // 글쓰기
  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const { title, content } = createPostDto;
    const author = await this.userModel
      .findById(userId)
      .select('username')
      .exec();

    const createPost = new this.postModel({
      title,
      content,
      author,
    });
    // 실제 MongoDB에 저장
    return createPost.save();
  }

  //글목록
  async findAll(page: number): Promise<Post[]> {
    return this.postModel
      .find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * 10)
      .limit(10)
      .exec();
  }

  //글상세
  async findOne(id: string): Promise<Post> {
    const post = await this.postModel
      .findById(id)
      .populate('author', 'username')
      .exec();
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return post;
  }

  async getPostCount() {
    return this.postModel.countDocuments().exec();
  }

  // 삭제
  async delete(id: string, userId: string): Promise<void> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    // 작성자 확인
    if (post.author.toString() !== userId) {
      throw new UnauthorizedException('작성자만 삭제할 수 있습니다.');
    }

    await this.postModel.findByIdAndDelete(id).exec();
  }
}
