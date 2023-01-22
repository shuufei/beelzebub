import { HttpError } from './http-error';

export class InvalidAppAccessToken extends HttpError {
  constructor(errorMessage?: string) {
    super(401, errorMessage ?? 'invalid app access token');
  }
}
