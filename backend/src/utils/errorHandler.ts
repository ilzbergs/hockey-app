

/**
 * Sends a 500 response with an error message.
 *
 * @param res The Express response object.
 * @param error The error to log. Can be an Error object or a string.
 * @param message The error message to send in the response. Defaults to "Notika neparedz ta k ad " (Internal Server Error).
 * @returns The response object.
 */
export function handleApiError(
  res:any,
  error:any,
  message = 'Notika neparedza darbība'
) {
  console.error(error);
  return res.status(500).json({
    error: true,
    message,
  });
}
