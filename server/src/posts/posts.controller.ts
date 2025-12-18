import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt')) // 토큰검사용
  async create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.postService.create(createPostDto, req.user.userId);
  }

  @Get('findAll/:page')
  async getAllPosts(@Param('page') page: number) {
    return this.postService.findAll(page);
  }

  @Get('count')
  async getPostCount() {
    return this.postService.getPostCount();
  }

  @Get(':id')
  async getOnePost(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.postService.delete(id, req.user.userId);
  }
}
