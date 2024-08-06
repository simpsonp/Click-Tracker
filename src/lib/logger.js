// Import required local modules
import * as dbHandlerDefault from './dbOperations.js';

// Define an asynchronous function to log errors
export const logError = async (
  request,
  error,
  dbHandler = dbHandlerDefault
) => {
  try {
    // Retrieve the DynamoDB table name from environment variables
    const tableName = process.env.LOGGER_TABLE_NAME;

    // Ensure the table name is present
    if (!tableName) {
      // Throw an error if it is missing
      throw new Error('Missing required environment variable.');
    }

    // Get the current timestamp in ISO format
    const timestamp = new Date().toISOString();

    // Create the error message with timestamp and stack trace
    const errorMessage = error.stack;

    // Create the item to be stored in DynamoDB
    const item = {
      Id: timestamp, // Use timestamp as the ID
      // todo
      ApiEndpoint: 'redirects', // Specify the API endpoint
      ApiFullUrl: request, // Include the full URL of the request
      ErrorMessage: errorMessage, // Include the error message
    };

    // Write the error message to the database
    await dbHandler.writeItem(tableName, item);
  } catch (error) {
    // Log the error message
    console.error(error);
    // Return error for automated testing purpose
    return error;
    // TODO: Integrate Sentry
  }
};

// Define a generic error response object
export const genericErrorResponse = {
  statusCode: '500',
  statusDescription: 'Unexpected Error',
  body: JSON.stringify({
    error: 'An unexpected error was encountered.',
  }),
};
