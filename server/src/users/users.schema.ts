import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // createdAt, updatedAt 자동 생성
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  //TODO: Post, Comment 연결
}

export const UserSchema = SchemaFactory.createForClass(User);
