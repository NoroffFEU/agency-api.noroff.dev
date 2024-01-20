import { Prisma } from "@prisma/client";
/**
 * This is designed to handle Prisma errors and return a JSON response with the appropriate error message and status code, aim specifically for dealing with get requests querystring errors.
 * @param {Error} error
 * @param {Response} res
 */
export function handlePrismaErrorResponse(error, res) {
  console.error(error);
  let errorMessage = "Internal server error";
  let statusCode = 500;
  let errorDetails = {};

  if (error instanceof Prisma.PrismaClientValidationError) {
    const invalidArgMatch = error.message.match(/Unknown arg `(\w+)`/);
    const suggestionMatch = error.message.match(/Did you mean `(\w+)`?/);
    const invalidArg = invalidArgMatch ? invalidArgMatch[1] : "Unknown";
    const suggestedArg = suggestionMatch ? suggestionMatch[1] : "Unknown";

    errorMessage = `Database query validation error: Invalid argument '${invalidArg}'. Did you mean '${suggestedArg}'?`;
    statusCode = 400; // Bad Request

    errorDetails = {
      type: error.constructor.name,
      invalidArgument: invalidArg,
      suggestedArgument: suggestedArg,
    };
  } else {
    errorDetails = {
      type: error.constructor ? error.constructor.name : "Unknown",
      message: error.message
        ? error.message
        : "No additional error information available.",
    };
  }

  res.status(statusCode).json({
    message: errorMessage,
    statusCode: statusCode,
    errorDetails,
  });
}
