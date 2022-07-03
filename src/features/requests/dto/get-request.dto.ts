import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PaginationDto } from '../../../utils/dto/pagination.dto';

export class GetRequestDto extends PaginationDto {
  @Type(() => Number)
  @IsOptional()
  ownerId?: number;
}
