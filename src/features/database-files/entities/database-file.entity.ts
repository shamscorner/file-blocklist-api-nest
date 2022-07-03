import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../features/users/entities/user.entity';
import { Request } from '../../../features/requests/entities/request.entity';

@Entity()
export class DatabaseFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  public name: string;

  @Column()
  public size: number;

  @Column()
  public extension: string;

  @CreateDateColumn()
  public uploadedAt: Date;

  @Column()
  public downloadLink: string;

  @Column({ default: false })
  public isBlocked: boolean;

  @Column({
    type: 'bytea',
  })
  public data: Uint8Array;

  @ManyToOne(() => User, (owner: User) => owner.files)
  public owner: User;

  @OneToMany(() => Request, (request: Request) => request.file)
  public requests?: Request[];
}
