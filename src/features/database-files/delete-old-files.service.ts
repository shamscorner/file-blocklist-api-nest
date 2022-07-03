import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseFilesService } from './database-files.service';

@Injectable()
export class DeleteOldFilesService {
  private readonly logger = new Logger(DeleteOldFilesService.name);

  constructor(private readonly databaseFilesService: DatabaseFilesService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    const pastDays = 14; // 14 days past from now

    this.databaseFilesService.deleteOlderFiles(pastDays);

    this.logger.debug(`Deleted files that are older than ${pastDays} days`);
  }
}
