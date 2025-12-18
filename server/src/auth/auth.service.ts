import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  //1. 회원 정보 조회를 위해 UserService 주입
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // 2. 사용자 검증 (아이디/비번 맞는지)
  async validateUser(username: string, pass: string): Promise<any> {
    // 아이디로 유저 찾기
    const user = await this.userService.findOne(username);

    // 유저가 있다면 비밀번호 맞는지 확인
    if (user && (await bcrypt.compare(pass, user.password))) {
      // 비밀번호 뺴고 유저정보만 리턴
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  // 로그인 (토근발급 포함)
  async login(user: any) {
    const payload = { username: user.username, sub: user._id }; // 토근에 담을 정보
    return {
      access_token: this.jwtService.sign(payload), //서명해서 토큰발급
    };
  }
}
