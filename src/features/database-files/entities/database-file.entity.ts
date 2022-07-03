import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { User } from '../../../features/users/entities/user.entity';
import { Request } from '../../../features/requests/entities/request.entity';
import { getAppConfigOptions } from 'src/config/app.config';
import { FileStatusEnum } from '../enums/file-status.enum';

@Entity()
export class DatabaseFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  public name: string;

  @Column()
  public size: number;

  @Column()
  public mimeType: string;

  @CreateDateColumn()
  public uploadedAt: Date;

  @Transform(({ value }) => `${getAppConfigOptions().url}/api/v1/${value}`)
  @Column()
  public downloadUrl: string;

  @Column({
    type: 'enum',
    enum: FileStatusEnum,
    default: FileStatusEnum.OPEN,
  })
  public status: FileStatusEnum;

  @Exclude()
  @Column({
    type: 'bytea',
  })
  public data: Uint8Array;

  @ManyToOne(() => User, (owner: User) => owner.files)
  public owner: User;

  @OneToMany(() => Request, (request: Request) => request.file)
  public requests?: Request[];
}
