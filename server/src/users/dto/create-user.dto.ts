import { IsString, Length } from 'class-validator';

//프론트엔드에서 보낸 데이터(아이디, 비번 등)가 담긴 가방
export class CreateUserDto {
  @IsString()
  @Length(4, 20)
  username: string;

  @IsString()
  @Length(4, 20)
  password: string;
}
