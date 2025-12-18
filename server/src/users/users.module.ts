import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UserService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    //DB collection 등록
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService], // 다른 모듈에서 쓰기위해 내보내기
})
export class UsersModule {}
