import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { DatabaseFilesService } from './database-files.service';
import { Readable } from 'stream';
import { Response } from 'express';

@Controller('database-files')
export class DatabaseFilesController {
  constructor(private readonly databaseFilesService: DatabaseFilesService) {}

  @Get(':id')
  async getDatabaseFileById(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const file = await this.databaseFilesService.getFileById(id);

    const stream = Readable.from(file.data);

    response.set({
      'Content-Disposition': `inline; filename="${file.name}"`,
      'Content-Type': 'image',
    });

    return new StreamableFile(stream);
  }
}
