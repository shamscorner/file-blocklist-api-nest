import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateFileRequest {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  requestId?: number;
}
