import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DatabaseFileUpdatedEvent } from '../../database-files/events/database-file-updated.event';
import { RequestsService } from '../requests.service';

@Injectable()
export class DatabaseFileUpdatedListener {
  constructor(private readonly requestsService: RequestsService) {}

  @OnEvent('database-file.updated')
  handleOrderCreatedEvent({ requestId, ownerId }: DatabaseFileUpdatedEvent) {
    this.requestsService.reject(requestId, ownerId);
  }
}
