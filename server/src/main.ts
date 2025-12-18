import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 이상한 값은 거들떠도 안 봄 (보안!)
    }),
  );
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
