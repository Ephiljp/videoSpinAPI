/* eslint-disable prettier/prettier */
import { ArduinoService } from './arduino.service';
/* eslint-disable prettier/prettier */
import { ArduinoController } from './arduino.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [ ],
  controllers: [ArduinoController],
  providers: [ArduinoService],
})
export class ArduinoModule {}
