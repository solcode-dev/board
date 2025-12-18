import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './users/users.service';
import { PostService } from './posts/posts.service';
import { User } from './users/users.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const userService = app.get(UserService);
    const postService = app.get(PostService);

    console.log('🌱 Start seeding...');

    // 1. Create Users
    const users: User[] = [];
    const USER_COUNT = 20;
    
    console.log(`Creating ${USER_COUNT} users...`);
    for (let i = 1; i <= USER_COUNT; i++) {
      const username = `user${i}`;
      const password = `password${i}`;
      
      try {
        const existing = await userService.findOne(username);
        if (existing) {
          users.push(existing);
          // console.log(`User already exists: ${username}`);
        } else {
          const newUser = await userService.create({ username, password });
          users.push(newUser);
          console.log(`Created user: ${username}`);
        }
      } catch (error) {
        console.error(`Failed to check/create user ${username}:`, error.message);
      }
    }

    // 2. Create Posts
    const POST_COUNT = 50;
    console.log(`Creating ${POST_COUNT} posts...`);

    if (users.length === 0) {
      console.error('No users available to create posts.');
      return;
    }

    for (let i = 1; i <= POST_COUNT; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const title = `게시글 제목 ${i} - ${randomUser.username}`;
        const content = `안녕하세요! ${randomUser.username}입니다.\n\n이것은 ${i}번째 게시글 내용입니다.\n더미 데이터가 잘 들어갔는지 확인해보세요.\n\n줄바꿈도\n잘\n되는지\n확인합니다.`;
        
        try {
            await postService.create({ title, content }, randomUser._id.toString());
            // console.log(`Created post ${i}`);
        } catch (error) {
            console.error(`Failed to create post ${i}:`, error.message);
        }
    }

    console.log('✅ Seeding completed!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
