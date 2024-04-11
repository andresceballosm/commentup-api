import httpStatus from 'http-status';

/**
 * @extends Error
 */

interface IError {
  errors?: any;
  status?: number;
  isPublic?: boolean;
  isOperational?: boolean;
  message: string;
  stack?: string;
}

class ExtendableError extends Error {
  status = 400;
  errors= null;
  isPublic= false;
  isOperational= true

  constructor({
    message, errors, status, isPublic, stack,
  }: any) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    this.stack = stack;
    // Error.captureStackTrace(this, this.constructor.name);
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to customer or not.
   */
  constructor({
    message,
    errors,
    stack,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic = false,
  }: IError) {
    super({
      message, errors, status, isPublic, stack,
    });
  }
}

export default APIError;