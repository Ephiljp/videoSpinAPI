/* eslint-disable prettier/prettier */
/*
https://docs.nestjs.com/controllers#controllers
*/

import { ArduinoService } from './arduino.service';

import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';

@Controller()
export class ArduinoController {

    constructor(private arduinoService:ArduinoService){}

    @Get('arduino')
    @HttpCode(HttpStatus.OK)
    async createQuarto(@Body() body: any,@Query() query): Promise<any> {


      this.arduinoService.sendArduinoCommand(query.status)
    }
}
