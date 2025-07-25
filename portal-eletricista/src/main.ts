import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Permite acessar http://localhost:3000/uploads/nomedoarquivo.jpg
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.set('trust proxy', 1);
app.enableCors({ origin: '*' });
  await app.listen(3000);
}
bootstrap();
