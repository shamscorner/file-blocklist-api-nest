import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../features/users/entities/user.entity';
import { DatabaseFile } from '../../../features/database-files/entities/database-file.entity';
import { ActionType } from '../enums/action-type.enum';

@Index(['user', 'file'], { unique: true })
@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public reason: string;

  @Column({
    type: 'enum',
    enum: ActionType,
    default: ActionType.BLOCK,
  })
  public actionType: ActionType;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne(() => User, (user: User) => user.requests, {
    cascade: null,
  })
  public user: User;

  @ManyToOne(() => DatabaseFile, (file: DatabaseFile) => file.requests, {
    onDelete: 'CASCADE',
  })
  public file: DatabaseFile;
}
