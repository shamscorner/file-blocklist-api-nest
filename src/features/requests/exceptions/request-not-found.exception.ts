import { NotFoundException } from '@nestjs/common';

export class RequestNotFoundException extends NotFoundException {
  constructor(requestId: number) {
    super(`File-request with id ${requestId} not found`);
  }
}
