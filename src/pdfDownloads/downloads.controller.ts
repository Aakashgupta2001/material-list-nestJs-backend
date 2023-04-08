import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Query,
  Render,
  HttpCode,
  StreamableFile,
  UsePipes,
  UseFilters,
  Header,
} from '@nestjs/common';
import { DownloadService } from './downloads.service';

import { Response } from 'express';

import { ObjectId } from 'mongoose';
import { Request } from '@nestjs/common';
@Controller('download')
export class DownloadController {
  constructor(private downloadService: DownloadService) {}

  @Get(':id')
  @HttpCode(200)
  // @Header('Content-Type', 'application/pdf')
  async findOne(
    @Param('id') id: ObjectId,
    @Query('name') name: string,

    @Req() req: Request,
  ) {
    const pdfFile = await this.downloadService.downloadPdf(req, id, name);
    return new StreamableFile(pdfFile);
  }

  // @Get()
  // root(@Res() res: Response) {
  //   return res.render(this.downloadService.getViewName(), {
  //     message: 'Hello world!',
  //   });
  // }

  // @Get()
  // root(@Res() res: Response) {
  //   {
  //     return res.render(this.downloadService.getViewName(), {
  //       message: 'Hello world!',
  //     });
  //   }
  // }
  // @Get()
  // @Render('index.hbs')
  // root() {
  //   return { message: 'Hello world!' };
  // }
}
