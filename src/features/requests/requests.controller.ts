import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthenticationGuard } from '../../authentication/jwt-authentication.guard';
import { RequestWithUser } from '../../authentication/request-with-user.interface';
import { PaginatedResultDto } from '../../utils/dto/paginated-result.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { GetRequestDto } from './dto/get-request.dto';
import { Request } from './entities/request.entity';
import { RequestsService } from './requests.service';

@Controller('requests')
@ApiTags('requests')
@ApiExtraModels(PaginatedResultDto)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get('')
  @ApiOkResponse({
    description: 'All the file-requests have been fetched successfully!',
    type: [Request],
  })
  findAll(@Query() { ownerId, page = 1, limit = 30 }: GetRequestDto) {
    return this.requestsService.getAll(ownerId, { page, limit });
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be a valid id for the file-request to delete',
    type: Number,
  })
  @ApiOkResponse({
    description: 'A file-request with the id has been deleted successfully!',
    type: Request,
  })
  @ApiNotFoundResponse({
    description: 'A file-request with given id does not exist.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @UseGuards(JwtAuthenticationGuard)
  @HttpCode(204)
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RequestWithUser,
  ) {
    const user = request.user;
    return this.requestsService.reject(id, user.id);
  }

  @Post('/files/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be a valid id for the file to add request',
    type: String,
  })
  @ApiBody({
    description: 'Create a file request',
    type: CreateRequestDto,
  })
  @ApiCreatedResponse({
    description: 'A request of the user has been created successfully!',
    type: Request,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @UseGuards(JwtAuthenticationGuard)
  createRequest(
    @Param('id') fileId: string,
    @Body() createRequestDto: CreateRequestDto,
    @Req() request: RequestWithUser,
  ) {
    const user = request.user;
    return this.requestsService.create(fileId, createRequestDto, user);
  }
}
