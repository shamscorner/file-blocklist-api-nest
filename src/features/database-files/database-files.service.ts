import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../../utils/dto/pagination.dto';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { DatabaseFile } from './entities/database-file.entity';
import { FileMetaType } from './types/file-meta';
import { PaginatedResultDto } from '../../utils/dto/paginated-result.dto';
import { getPaginationProps } from '../../utils/get-pagination-props';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class DatabaseFilesService {
  constructor(
    @InjectRepository(DatabaseFile)
    private databaseFilesRepository: Repository<DatabaseFile>,
  ) {}

  /**
   * Upload a file to the database
   *
   * @param dataBuffer Uploaded file buffer
   * @param name The name of the File
   * @param fileMetaData The meta data regarding to the file's size, extension, etc.
   * @param owner The user who uploaded the file
   * @returns The newly uploaded file's record
   */
  async uploadFile(
    dataBuffer: Buffer,
    name: string,
    { size, mimeType }: FileMetaType,
    owner: User,
  ): Promise<DatabaseFile> {
    const downloadUrl = this.generateRandomText();

    const newFile = await this.databaseFilesRepository.create({
      name,
      size,
      mimeType,
      downloadUrl,
      data: dataBuffer,
      owner,
    });

    const newlyCreatedFile = await this.databaseFilesRepository.save(newFile);
    return newlyCreatedFile;
  }

  /**
   * Get all the files of a user
   *
   * @param ownerId A valid id of the owner of the files to get or pass 0 to get all the user's files
   * @param paginationDto Information about the page, limit, skipped items for pagination
   * @returns Paginated data of the files that user requested
   */
  async getAllFiles(
    ownerId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto<DatabaseFile>> {
    const { page, limit, skippedItems } = getPaginationProps(paginationDto);

    const where: FindManyOptions<DatabaseFile>['where'] = {};

    if (ownerId) {
      where.owner = {
        id: ownerId,
      };
    }

    const [files, filesCount] = await this.databaseFilesRepository.findAndCount(
      {
        where,
        skip: skippedItems,
        take: limit,
        order: {
          uploadedAt: 'DESC',
        },
      },
    );

    return {
      totalCount: filesCount,
      page: page,
      limit: limit,
      data: files,
    };
  }

  /**
   * Get a File record from the database
   *
   * @param fileId A valid id of the file to get
   * @returns The record of the file
   */
  async getFileById(fileId: string): Promise<DatabaseFile> {
    const file = await this.databaseFilesRepository.findOne({
      where: {
        id: fileId,
      },
      relations: {
        owner: true,
      },
    });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  /**
   *  Update a file's record on the database
   *
   * @param fileId A valid id of the file to update
   * @param fileDto The body of the request
   * @param ownerId A valid user id who own the file that will be updated
   * @returns The record of the updated file
   */
  async updateFile(
    fileId: string,
    fileDto: UpdateFileDto,
    ownerId: number,
  ): Promise<DatabaseFile> {
    const oldFile = await this.databaseFilesRepository.findOne({
      where: {
        id: fileId,
      },
      relations: {
        owner: true,
      },
    });

    if (!oldFile) {
      throw new NotFoundException();
    }

    if (oldFile.owner && oldFile.owner.id === ownerId) {
      await this.databaseFilesRepository.update(fileId, fileDto);

      const updatedFile = await this.databaseFilesRepository.findOne({
        where: {
          id: fileId,
        },
        relations: {
          owner: true,
        },
      });

      if (!updatedFile) {
        throw new NotFoundException();
      }

      return updatedFile;
    }

    throw new UnauthorizedException();
  }

  /**
   * Delete a file from the database
   *
   * @param fileId A valid id of the file to delete
   * @param ownerId A valid user id who own the file that will be deleted
   */
  async deleteFile(fileId: string, ownerId: number): Promise<void> {
    const oldFile = await this.databaseFilesRepository.findOne({
      where: {
        id: fileId,
      },
      relations: {
        owner: true,
      },
    });

    if (!oldFile) {
      throw new NotFoundException();
    }

    if (oldFile.owner && oldFile.owner.id === ownerId) {
      const deleteResponse = await this.databaseFilesRepository.delete(fileId);

      if (!deleteResponse.affected) {
        throw new NotFoundException();
      }

      return;
    }

    throw new UnauthorizedException();
  }

  /**
   * Get a file by the download token
   *
   * @param token A valid token to download a file
   * @returns An entire streamable file data
   */
  async getFileByDownloadToken(token: string) {
    const file = await this.databaseFilesRepository.findOne({
      where: {
        downloadUrl: token,
      },
    });

    if (!file) {
      throw new NotFoundException();
    }

    return file;
  }

  /**
   * Generate a random text
   *
   * @returns A generated random text
   */
  generateRandomText(): string {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 100; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
