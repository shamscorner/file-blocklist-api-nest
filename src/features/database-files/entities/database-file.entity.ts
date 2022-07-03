import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  public name: string;

  @Column()
  public size: number;

  @Column()
  public mimeType: string;

  @CreateDateColumn()
  public downloadedAt: Date;

  @Transform(
    ({ value }) =>
      `${getAppConfigOptions().url}:${
        getAppConfigOptions().port
      }/api/v1/database-files/download/${value}`,
  )
  @Index({ unique: true })
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

  @Exclude()
  @Column({
    default: 0,
  })
  public downloadCount?: number;
}
