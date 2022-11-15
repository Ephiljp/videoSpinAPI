/* eslint-disable prettier/prettier */
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { videoConsumer } from './media-consumer';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [ 
    BullModule.registerQueue({
      name: 'video-queue',
    }),
   ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
