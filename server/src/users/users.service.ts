import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.schema';
import * as bcrypt from 'bcrypt'; // 암호화도구

@Injectable() // "이 클래스(UserService)는 내가 직접 new UserService()로 만드는 게 아니라, 네가 알아서 관리해줘"
export class UserService {
  // "이 클래스를 다른 곳에서 쓸 수 있게 해줘"
  //1. DB모델 준비
  constructor(@InjectModel(User.name) private userModel: Model<User>) {} // 이 서비스가 실행될 때 DB를 다룰 수 있는 도구(Model)를 챙겨줘

  // 회원가입 로직
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    // 중복가입 방지
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) throw new ConflictException('이미 존재한느 사용자입니다'); // 409 에러

    // 비밀번호 암호화 (해싱)
    const hashedPassword = await bcrypt.hash(password, 10);

    // DB 저장 : 새 createUser 객체를 만든다.
    const createUser = new this.userModel({
      username,
      password: hashedPassword,
    });
    // this.userModel를 꺼내서, 받아온 데이터(createUserDto)를 넣고 Mongoose가 이해할 수 있는 형태(createUser)로 만든다.

    // 실제 MongoDB에 저장
    return createUser.save();
  }

  // 아이디 중복확인 로직
  async findOne(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }
}
