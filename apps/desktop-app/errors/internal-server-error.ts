import { HttpError } from './http-error';

export class InternalServerError extends HttpError {
  constructor(errorMessage?: string) {
    super(500, errorMessage ?? 'Internal Server Error');
  }
}
