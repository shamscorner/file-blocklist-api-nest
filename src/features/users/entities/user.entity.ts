import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { DatabaseFile } from '../../../features/database-files/entities/database-file.entity';

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

  @Column({ nullable: true })
  @Exclude()
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  public isTwoFactorAuthenticationEnabled: boolean;
}
