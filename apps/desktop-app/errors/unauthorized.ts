import { HttpError } from './http-error';

export class Unauthorized extends HttpError {
  constructor(errorMessage?: string) {
    super(401, errorMessage ?? 'Unauthorized');
  }
}
