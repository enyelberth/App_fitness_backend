import { HttpException, HttpStatus } from '@nestjs/common';

export class ResourceNotFoundException extends HttpException {
  constructor(resource: string) {
    super(`${resource} not found`, HttpStatus.NOT_FOUND);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super('Invalid email or password', HttpStatus.UNAUTHORIZED);
  }
}
