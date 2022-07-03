import { NotFoundException } from '@nestjs/common';

export class DatabaseFileNotFoundException extends NotFoundException {
  constructor(fileId: number) {
    super(`File with the id ${fileId} not found`);
  }
}
