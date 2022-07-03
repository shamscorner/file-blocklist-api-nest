import { IsEnum } from 'class-validator';
import { FileStatusEnum } from '../enums/file-status.enum';

export class UpdateFileDto {
  @IsEnum(FileStatusEnum)
  public status: FileStatusEnum;
}
