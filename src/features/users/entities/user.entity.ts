import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { DatabaseFile } from '../../../features/database-files/entities/database-file.entity';
import { Request } from '../../../features/requests/entities/request.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public phoneNumber?: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @OneToMany(() => DatabaseFile, (file: DatabaseFile) => file.owner)
  public files?: DatabaseFile[];

  @OneToMany(() => Request, (request: Request) => request.user)
  public requests?: Request[];

  @Column({ nullable: true })
  @Exclude()
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  public isTwoFactorAuthenticationEnabled: boolean;
}
