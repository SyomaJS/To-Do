import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function start() {
  try {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.PORT || 3030;
    app.setGlobalPrefix('api');
    app.use(cookieParser());

    const config = new DocumentBuilder()
      .setTitle('TO DO')
      .setDescription('The best to-do list')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/api/docs', app, document);

    await app.listen(PORT, () => {
      console.log(`Listening on ${PORT} port`);
    });
  } catch (error) {
    console.log(`Failed to listen on port`);
  }
}

start();
