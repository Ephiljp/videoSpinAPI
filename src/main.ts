import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/key.pem'),
    cert: fs.readFileSync('./secrets/certificate.pem'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.enableCors({
    origin: [
      '*.*',
      'http://localhost:8100',
      'http://localhost:4200',
      'https://192.168.1.104:4200',
      'http://192.168.1.104:4200',
      'https://192.168.1.104:8100',
    ],
  });
  await app.listen(3000, process.env.SERVIDOR_IP).then(() => {
    console.log('aplication started');
  });
}
bootstrap();
