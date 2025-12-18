import { IsString, Length } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @Length(1, 100)
  content: string;

  @IsString()
  postId: string;
}
