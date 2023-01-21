import { HttpError } from './http-error';

export class UnauthorizedError extends HttpError {
  constructor(errorMessage?: string) {
    super(401, errorMessage ?? 'Unauthorized');
  }
}
