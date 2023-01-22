import { HttpError } from './http-error';

export class BadRequest extends HttpError {
  constructor(errorMessage?: string) {
    super(400, errorMessage ?? 'Bad Request');
  }
}
