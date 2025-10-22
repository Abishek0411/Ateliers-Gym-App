import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication and mobile access
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://0.0.0.0:3000',
      // Add your local network IP for mobile access
      'http://10.213.71.173:3000', // Your actual local IP
      'http://192.168.1.100:3000', // Common alternative
      'http://192.168.0.100:3000', // Common alternative
      'http://10.0.0.100:3000', // Another common alternative
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  await app.listen(3001);
  console.log("🚀 Atelier's Fitness API is running on http://localhost:3001");
  console.log('📚 API Documentation: http://localhost:3001/api');
}
bootstrap();
