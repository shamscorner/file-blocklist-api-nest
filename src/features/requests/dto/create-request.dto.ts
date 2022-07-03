import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ActionType } from '../enums/action-type.enum';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  public reason: string;

  @IsEnum(ActionType)
  public actionType: ActionType;
}
