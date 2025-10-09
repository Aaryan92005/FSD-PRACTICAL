class AppError extends Error {
  constructor(message, statusCode, details) {
    const msg = typeof message === 'string' ? message : (message && message.message) || 'Error';
    super(msg);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Attach structured details when provided (e.g., validation errors)
    if (details) this.details = details;
    else if (message && typeof message === 'object') this.details = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
