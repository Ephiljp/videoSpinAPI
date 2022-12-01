/* eslint-disable prettier/prettier */
/* eslint-disable no-var */ /* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/*
https://docs.nestjs.com/providers#services
*/

import { InjectQueue } from '@nestjs/bull';
import { Injectable, Req, Res, UploadedFile } from '@nestjs/common';
import { Queue } from 'bull';
import * as fs from 'fs';
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
let supportedFiles = ['mp4', 'mov', 'm4v'];
import { encode, decode } from 'node-base64-image';

@Injectable()
export class MediaService {
  files = [];
  fileTxt = [];
  interval:any;
  canEdit = true;
  constructor() {
  this.interval =  setInterval(() => {
      const dirCont = fs.readdirSync('tmp');
      this.files = dirCont.filter((file) =>
        file.match(new RegExp(`.*\.(mp4)`, 'ig')),
      );

      this.fileTxt = dirCont.filter((file) =>
      file.match(new RegExp(`.*\.(txt)`, 'ig')),
    );

      if (this.files.length > 0 && this.fileTxt.length > 0 ) {
        if (this.canEdit) {
          console.log(this.files);
          this.converMedia(this.files[0]);
        }
      }
    }, 2000);
  }
  async fileUpload(@Req() req, @Res() res, @UploadedFile() file) {
    let fileName = this.getFileNameWithoutExtension(file.originalname);

    fs.appendFile(`tmp/${fileName}.txt`, req.body.evento, () => {});
    return res.status(201).json('OK');
  }

  async converMedia(file) {
    if (supportedFiles.includes(this.getFileExtension(file))) {
      this.canEdit = false;
      
      try {
        let fileName = this.getFileNameWithoutExtension(file);
        let fileConfig;
        let audioConfig = '';
        let frameConfig = '';
/*         setTimeout(() => {
          fileConfig =  JSON.parse(
            fs.readFileSync(`tmp/${fileName}.txt`, 'utf8'),
          );
        }, 200); */
     
        let folder = '';
        try {

          fileConfig =  JSON.parse(
            fs.readFileSync(`tmp/${fileName}.txt`, 'utf8'),
          );
       
        } catch (error) {
          fs.rename(`tmp/${file}`, `tmp1/err_${file}`, (err) => console.log(err));
          this.interval.clear();

          this.interval =  setInterval(() => {
            const dirCont = fs.readdirSync('tmp');
            this.files = dirCont.filter((file) =>
              file.match(new RegExp(`.*\.(mp4)`, 'ig')),
            );
      
            if (this.files.length > 0) {
              if (this.canEdit) {
                console.log(this.files);
                this.converMedia(this.files[0]);
              }
            }
          }, 2000);

          return
        }
  
      

        if (fileConfig) {
          if (fs.existsSync(`dist/${fileConfig.name}`)) {
            folder = `dist/${fileConfig.name}`
     
          }else{
           await fs.promises.mkdir(`dist/${fileConfig.name}`).then((e)=>{
            console.log('Criou a pasta')
            folder = `dist/${fileConfig.name}`
           })
          }
        }else[
          folder = `dist/media`
        ]

        console.log('fodler: '+folder)
        console.log(fileConfig);

        if (fileConfig && fileConfig.audio) {
          console.log(fileConfig.audio);
          if (fs.existsSync(`tmp/${fileConfig.audio}.mp3`)) {
            audioConfig = fileConfig.audio;
            console.log(audioConfig);
          }
        }

        /*    if (fileConfig && fileConfig.frame) {
          console.log(fileConfig.frame);
          if (fs.existsSync(`tmp/${fileConfig.frame}.png`)) {
            frameConfig = fileConfig.frame;
            console.log(frameConfig);
          }
        } */

        var command = ffmpeg();
        //  console.log(command)
        command.input(`tmp/${file}`).format('mp4');

        if (frameConfig) {
      
        }

        //command.input(`tmp/back1.png`);

        if (audioConfig) {
          command.input(`tmp/${audioConfig}.mp3`);
        }

        command.complexFilter(
          [
            {
              filter: 'trim',
              options: { start: '0', duration: fileConfig.vNormal },
              inputs: '0:v',
              outputs: ['t0'],
            },
            {
              filter: 'trim',
              options: {
                start: fileConfig.vNormal,
                duration: fileConfig.vSlow,
              },
              inputs: '0',
              outputs: ['t1'],
            },
            {
              filter: 'trim',
              options: {
                start: fileConfig.vNormal + fileConfig.vSlow,
                duration: fileConfig.vFast,
              },
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
              options: '1.5*PTS',
              inputs: 't2N',
              outputs: ['t2S'],
            },
            {
              filter: 'trim',
              options: { start: '0', duration: fileConfig.vNormal },
              inputs: '0:v',
              outputs: ['t0'],
            },
            {
              filter: 'trim',
              options: {
                start: fileConfig.vNormal,
                duration: fileConfig.vSlow,
              },
              inputs: '0',
              outputs: ['t1'],
            },
            {
              filter: 'trim',
              options: {
                start: fileConfig.vNormal + fileConfig.vSlow,
                duration: fileConfig.vFast,
              },
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
              options: '1.5*PTS',
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
      /*       {
              filter: 'overlay',
              options: { x: '0', y: '0' },
              inputs: ['output1'],
              outputs: ['output2'],
            }, */
          ],
          'output1',
        );

        if (audioConfig && !frameConfig) {
          command.outputOptions(['-map 1:0', '-shortest']);
        }

        if (audioConfig && frameConfig) {
          command.outputOptions(['-map 2:0', '-shortest']);
        }

        command
          .save(`${folder}/${fileName}_1.mp4`)
          .on('end', () => {
            this.createThumb(folder, fileName);

            this.moveFile(file, 'tmp1');
            //return res.status(201).json('OK');
          })
          .on('error', function (err, stdout, stderr) {
            // console.log('207'+file);
            //this.moveFile(file, 'tmp1');

            fs.rename(`tmp/${file}`, `tmp1/err_${file}`, (err) =>
              console.log(err),
            );
            const config = this.getFileNameWithoutExtension(file);
            fs.rename(`tmp/${config}.txt`, `tmp1/err_${config}.txt`, (err) =>
              console.log(err),
            );

            console.log('Cannot process video: ' + err.message);
            this.canEdit = true;
            //return res.status(500).json(`Failed`);
          });
      } catch (err) {
        console.log('error', err);
        fs.rename(`tmp/${file}`, `tmp1/err_${file}`, (err) => console.log(err));
        const config = this.getFileNameWithoutExtension(file);
        fs.rename(`tmp/${config}.txt`, `tmp1/err_${config}.txt`, (err) =>
          console.log(err),
        );
        this.canEdit = true;
        //return res.status(500).json(`Failed`);
      }
    } else {
      //res.status(201).json('success!!');
    }
  }

  createThumb(folder, fileName) {
    var command1 = ffmpeg();
    command1.input(`${folder}/${fileName}_1.mp4`);
    command1.screenshots({
      timestamps: ['1'],
      filename: `${fileName}_1.jpg`,
      folder: folder,
    });
  }

  moveFile(name, path) {
    console.log(name);
    const config = this.getFileNameWithoutExtension(name);
    fs.rename(`tmp/${name}`, `${path}/${name}`, (err) => console.log(err));
    fs.rename(`tmp/${config}.txt`, `${path}/${config}.txt`, (err) =>
      console.log(err),
    );
    this.canEdit = true;
  }

  getFileExtension = (file) => {
    let fileName = file.originalname;
    return file.split('.').pop();
  };

  getFileNameWithoutExtension = (file) => {
    return file.split('.').slice(0, -1).join('.');
  };


  
}
