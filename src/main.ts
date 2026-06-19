import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  const config = new DocumentBuilder()
    .setTitle('My API List')
    .setDescription('Laxmi Art Jewellers API Documentation')
    .setVersion('1.0')
    .addBearerAuth() // JWT auth ke liye
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/laxmiArtJewellers', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
