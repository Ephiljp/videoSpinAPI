import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/key.pem'),
    cert: fs.readFileSync('./secrets/certificate.pem'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.enableCors({
    origin: [
      '*.*',
      'http://192.168.31.199:8100',
      'http://192.168.31.199:4200',
      'https://192.168.31.199:4200',
      'http://192.168.31.199:4200',
      'https://192.168.31.199:8100'
    ],
  });
  await app.listen(3000, '192.168.1.104').then(() => {
    console.log('aplication started');
  });
}
bootstrap();
