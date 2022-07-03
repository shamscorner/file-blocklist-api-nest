import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseFilesModule } from '../database-files/database-files.module';
import { Request } from './entities/request.entity';
import { DatabaseFileUpdatedListener } from './listeners/database-file-updated.listener';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

@Module({
  imports: [TypeOrmModule.forFeature([Request]), DatabaseFilesModule],
  controllers: [RequestsController],
  providers: [RequestsService, DatabaseFileUpdatedListener],
})
export class RequestsModule {}
