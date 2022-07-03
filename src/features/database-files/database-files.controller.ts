import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Readable } from 'stream';
import { Response } from 'express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DatabaseFile } from './entities/database-file.entity';
import { FileUploadDto } from './dto/file-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from '../../authentication/request-with-user.interface';
import { PaginatedResultDto } from '../../utils/dto/paginated-result.dto';
import { DatabaseFilesService } from './database-files.service';
import { JwtAuthenticationGuard } from 'src/authentication/jwt-authentication.guard';
import { GetFileDto } from './dto/get-file.dto';

@Controller('database-files')
@ApiTags('database-files')
@ApiExtraModels(PaginatedResultDto)
export class DatabaseFilesController {
  constructor(private readonly databaseFilesService: DatabaseFilesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a new file',
    type: FileUploadDto,
  })
  @ApiCreatedResponse({
    description: 'A file of the user has been uploaded successfully!',
    type: DatabaseFile,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.databaseFilesService.uploadFile(
      file.buffer,
      file.originalname,
      {
        size: file.size,
        mimeType: file.mimetype,
      },
      request.user,
    );
  }

  @Get()
  @ApiOkResponse({
    description: 'All the files have been fetched successfully!',
    type: [DatabaseFile],
  })
  findAll(@Query() { ownerId, page = 1, limit = 30 }: GetFileDto) {
    return this.databaseFilesService.getAllFiles(ownerId, { page, limit });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be a valid id for the file to fetch',
    type: String,
  })
  @ApiOkResponse({
    description: 'A file with the id has been fetched successfully!',
    type: DatabaseFile,
  })
  @ApiNotFoundResponse({
    description: 'A file with given id does not exist.',
  })
  async getFileById(
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
