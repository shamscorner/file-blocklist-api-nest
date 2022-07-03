import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../../utils/dto/pagination.dto';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { Request } from './entities/request.entity';
import { PaginatedResultDto } from '../../utils/dto/paginated-result.dto';
import { getPaginationProps } from '../../utils/get-pagination-props';
import { DatabaseFilesService } from '../database-files/database-files.service';
import { DatabaseFileNotFoundException } from '../database-files/exceptions/database-file-not-found.exception';
import { RequestNotFoundException } from './exceptions/request-not-found.exception';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestsRepository: Repository<Request>,
    private readonly databaseFilesService: DatabaseFilesService,
  ) {}

  /**
   * Create a file-request if not exist or update the existing file-request
   *
   * @param fileId A valid file id in which the request will be created
   * @param createRequestDto The body of creating a file-request
   * @param user The user object of whom is creating that file-request
   * @returns The newly created file-request
   */
  async create(
    fileId: string,
    createRequestDto: CreateRequestDto,
    user: User,
  ): Promise<Request> {
    const file = await this.databaseFilesService.getFileById(fileId);

    if (!file) {
      throw new DatabaseFileNotFoundException(fileId);
    }

    const result = await this.requestsRepository.upsert(
      {
        ...createRequestDto,
        user,
        file,
      },
      ['user', 'file'],
    );

    const newRequest = await this.requestsRepository.findOne({
      where: {
        id: result.raw[0].id,
      },
      relations: {
        user: true,
        file: true,
      },
    });

    return newRequest;
  }

  /**
   * Get all the requests of a user
   *
   * @param ownerId A valid id of the owner of the requests to get or pass 0 to get all the user's file-requests
   * @param paginationDto Information about the page, limit, skipped items for pagination
   * @returns Paginated data of the file-requests that user requested
   */
  async getAll(
    ownerId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto<Request>> {
    const { page, limit, skippedItems } = getPaginationProps(paginationDto);

    const where: FindManyOptions<Request>['where'] = {};

    if (ownerId) {
      where.user = {
        id: ownerId,
      };
    }

    const [requests, requestsCount] =
      await this.requestsRepository.findAndCount({
        where,
        skip: skippedItems,
        take: limit,
        order: {
          updatedAt: 'DESC',
        },
        relations: {
          file: true,
          user: true,
        },
      });

    return {
      totalCount: requestsCount,
      page: page,
      limit: limit,
      data: requests,
    };
  }

  /**
   * Reject a file-request
   *
   * @param requestId A valid id of the file-request to reject
   * @param userId A valid user id who is rejecting the file-request
   */
  async reject(requestId: number, userId: number): Promise<void> {
    const oldRequest = await this.requestsRepository.findOne({
      where: {
        id: requestId,
      },
      relations: {
        file: {
          owner: true,
        },
      },
    });

    if (!oldRequest) {
      throw new RequestNotFoundException(requestId);
    }

    const { owner } = oldRequest.file;

    if (owner && owner.id === userId) {
      const deleteResponse = await this.requestsRepository.delete(requestId);

      if (!deleteResponse.affected) {
        throw new RequestNotFoundException(requestId);
      }

      return;
    }

    throw new UnauthorizedException();
  }
}
