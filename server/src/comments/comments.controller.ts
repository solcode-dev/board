import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { CommentService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt')) // 토큰검사용
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.commentService.create(createCommentDto, req.user.userId);
  }

  @Post('findAll')
  async findAll(@Body('postId') postId: string) {
    return this.commentService.findAll(postId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.commentService.delete(id, req.user.userId);
  }
}
