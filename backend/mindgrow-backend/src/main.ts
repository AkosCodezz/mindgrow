import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix: all routes become /api/auth, /api/journals, etc.
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(helmet());

  // CORS - allow Next.js frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'https://coderift.vercel.app'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('CodeRift API')
    .setDescription('CodeRift Backend - NestJS + Prisma + Supabase')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 CodeRift Backend running on http://localhost:${port}`);
  console.log(`📄 Swagger UI: http://localhost:${port}/docs`);
}
bootstrap();
