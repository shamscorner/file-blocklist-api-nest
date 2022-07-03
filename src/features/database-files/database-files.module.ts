import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseFilesService } from './database-files.service';
import { DatabaseFile } from './entities/database-file.entity';
import { DatabaseFilesController } from './database-files.controller';
import { DeleteOldFilesService } from './delete-old-files.service';

@Module({
  imports: [TypeOrmModule.forFeature([DatabaseFile]), ConfigModule],
  providers: [DatabaseFilesService, DeleteOldFilesService],
  exports: [DatabaseFilesService],
  controllers: [DatabaseFilesController],
})
export class DatabaseFilesModule {}
