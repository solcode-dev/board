import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// 토큰이 유효한지 검사한다
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // 헤더의 Bearer토큰해서 토큰 가져와라
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // 만료된 토큰 거절
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }
  // 토큰이 유효하면 아래 실행
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
