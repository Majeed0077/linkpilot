export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function badRequest(message) {
  return new HttpError(400, message);
}

export function conflict(message) {
  return new HttpError(409, message);
}

export function notFound(message) {
  return new HttpError(404, message);
}

export function gone(message) {
  return new HttpError(410, message);
}

export function forbidden(message) {
  return new HttpError(403, message);
}
