export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest(msg: string) {
    return new ApiError(msg, 400, 'BAD_REQUEST');
  }

  static unauthorized(msg: string = 'Unauthorized') {
    return new ApiError(msg, 401, 'UNAUTHORIZED');
  }

  static forbidden(msg: string = 'Forbidden') {
    return new ApiError(msg, 403, 'FORBIDDEN');
  }

  static notFound(msg: string = 'Not found') {
    return new ApiError(msg, 404, 'NOT_FOUND');
  }
}
