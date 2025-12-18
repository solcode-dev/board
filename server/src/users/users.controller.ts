import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('signup') // 1. 회원가입
  async signup(@Body() createUserDto: CreateUserDto) {
    // dto를 service에 전달
    return this.userService.create(createUserDto); // userService.creeate는 Promise를 돌려줌. NestJS가 알아서 await처리해줌.
  }
}
