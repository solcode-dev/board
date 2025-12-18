import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() req: CreateUserDto) {
    const validUser = await this.authService.validateUser(
      req.username,
      req.password,
    );

    if (!validUser) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 틀렸습니다.');
    }

    return this.authService.login(validUser);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
