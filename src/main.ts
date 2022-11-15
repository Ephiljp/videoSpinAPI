import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
async function bootstrap() {
  /*   const httpsOptions = {
    key: fs.readFileSync('./secrets/key.pem'),
    cert: fs.readFileSync('./secrets/certificate.pem'),
  };,{ httpsOptions } */
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      '*.*',
      'http://localhost:8100',
      'http://localhost:4200',
      'https://192.168.1.104:4200',
      'http://192.168.1.104:4200',
    ],
  });
  await app.listen(3000, 'localhost').then(() => {
    console.log('aplication started');
  });
}
bootstrap();
