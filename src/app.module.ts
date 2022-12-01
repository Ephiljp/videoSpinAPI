import { ArduinoModule } from './arduino/arduino.module';
import { MediaModule } from './media/media.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { videoConsumer } from './media/media-consumer';

@Module({
  imports: [
    ArduinoModule,
    MediaModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, videoConsumer],
})
export class AppModule {}
