/**
 * Middleware xử lý lỗi
 */
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Server Error';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Middleware 404
 */
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route không tìm thấy: ${req.originalUrl}`,
  });
};
