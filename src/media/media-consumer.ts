/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as fs from 'fs';
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const supportedFiles = ['mp4', 'mov', 'm4v'];

@Processor('video-queue')
 class videoConsumer {  
  @Process('video-job')
  async videoTransformeJob(job: Job<any>) {
    
    //console.log(job)
    const {req} = job.data;



    if (supportedFiles.includes(this.getFileExtension(req))) {
        try {
          const fileName =await this.getFileNameWithoutExtension(req.originalname);
          const command =await ffmpeg();
          //  console.log(command)
          command.input(`tmp/${req.filename}`).format('mp4');
          command.input(`tmp/back.png`);
          command.input(`tmp/audio.mp3`);
          command
            .complexFilter(
              [
                {
                  filter: 'trim',
                  options: { start: '0', duration: '5' },
                  inputs: '0:v',
                  outputs: ['t0'],
                },
                {
                  filter: 'trim',
                  options: { start: '5', duration: '5' },
                  inputs: '0',
                  outputs: ['t1'],
                },
                {
                  filter: 'trim',
                  options: { start: '10', duration: '5' },
                  inputs: '0',
                  outputs: ['t2'],
                },
                {
                  filter: 'setpts',
                  options: 'PTS-STARTPTS',
                  inputs: 't0',
                  outputs: ['t0N'],
                },
  
                {
                  filter: 'setpts',
                  options: 'PTS-STARTPTS',
                  inputs: 't1',
                  outputs: ['t1N'],
                },
                {
                  filter: 'setpts',
                  options: 'PTS-STARTPTS',
                  inputs: 't2',
                  outputs: ['t2N'],
                },
                {
                  filter: 'setpts',
                  options: '0.5*PTS',
                  inputs: 't1N',
                  outputs: ['t1F'],
                },
  
                {
                  filter: 'setpts',
                  options: '2*PTS',
                  inputs: 't2N',
                  outputs: ['t2S'],
                },
                {
                  filter: 'trim',
                  options: { start: '0', duration: '5' },
                  inputs: '0',
                  outputs: ['t0'],
                },
                {
                  filter: 'trim',
                  options: { start: '5', duration: '5' },
                  inputs: '0',
                  outputs: ['t1'],
                },
                {
                  filter: 'trim',
                  options: { start: '10', duration: '5' },
                  inputs: '0',
                  outputs: ['t2'],
                },
                {
                  filter: 'setpts',
                  options: 'PTS-STARTPTS',
                  inputs: 't0',
                  outputs: ['t0N'],
                },
  
                {
                  filter: 'setpts',
                  options: 'PTS-STARTPTS',
                  inputs: 't1',
                  outputs: ['t1N'],
                },
                {
                  filter: 'setpts',
                  options: 'PTS-STARTPTS',
                  inputs: 't2',
                  outputs: ['t2N'],
                },
                {
                  filter: 'setpts',
                  options: '0.5*PTS',
                  inputs: 't1N',
                  outputs: ['t1F'],
                },
  
                {
                  filter: 'setpts',
                  options: '2*PTS',
                  inputs: 't2N',
                  outputs: ['t2S'],
                },
                {
                  filter: 'concat',
                  options: { n: '3' },
                  inputs: ['t0N', 't1F', 't2S'],
                  outputs: ['c0'],
                },
  
                {
                  filter: 'concat',
                  options: { n: '3' },
                  inputs: ['t0N', 't1F', 't2S'],
                  outputs: ['c1'],
                },
  
                {
                  filter: 'reverse',
                  inputs: 'c0',
                  outputs: ['r'],
                },
                {
                  filter: 'concat',
                  options: { n: '2' },
                  inputs: ['c1', 'r'],
                  outputs: 'output',
                },
  
                '[output]scale=720:1080[scaled]',
                {
                  filter: 'framerate',
                  options: { fps: '60' },
                  inputs: ['scaled'],
                  outputs: 'output1',
                },
                /*    {
                  filter: 'overlay',
                  options: { x: '0', y: '0' },
                  inputs: ['scaled'],
                  outputs: ['output1'],
                }, */
              ],
              'output1',
            )
            .outputOptions(['-map 2:0', '-shortest'])
            .save(`dist/media/${fileName}_1.mp4`)
            .on('end', () => {
              setTimeout(() => {
                //return res.status(201);
              }, 300);
            })
            .on('error', function (err, stdout, stderr) {
              console.log('Cannot process video: ' + err.message);
             // return res.status(500).json(`Failed`);
            });
        } catch (err) {
          console.log('error', err);
         // return res.status(500).json(`Failed`);
        }
      } else {
      //  res.status(201).json('success!!');
      }
  }


  getFileExtension = (file) => {
    const fileName = file.originalname;
    return fileName.split('.').pop();
  };

  getFileNameWithoutExtension = (file) => {
    return file.split('.').slice(0, -1).join('.');
  };
}

export {videoConsumer}