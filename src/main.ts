import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
 
  // Enable global validation via class-validator
  app.useGlobalPipes(new ValidationPipe());
 
  await app.listen(3000);
  console.log(`🚀 Application running at http://localhost:3000`);
  console.log(`🎯 GraphQL Playground: http://localhost:3000/graphql`);
}
bootstrap();