import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(1, 50)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
