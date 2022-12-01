/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
/*  */  const httpsOptions = {
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
      `http://${process.env.SERVIDOR_IP}:8100`,
      `http://${process.env.SERVIDOR_IP}:4200`,
      `https://${process.env.SERVIDOR_IP}:8100`,
      `https://${process.env.SERVIDOR_IP}:4200`,
      `https://${process.env.SERVIDOR_IP}`,
      `https://${process.env.SERVIDOR_IP}:443`,
      `http://localhost:4200`,
    ],
  });
  await app.listen(3000, process.env.SERVIDOR_IP).then(() => {
    console.log('aplication started');
    console.log(process.env.SERVIDOR_IP)
  });
}
bootstrap();
 