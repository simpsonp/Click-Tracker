// Import required modules
import { downloadsHandler } from './handlers/downloadsHandler.js';
import { redirectsHandler } from './handlers/redirectsHandler.js';
import { statusHandler } from './handlers/statusHandler.js';
import { forwardToOrigin } from './lib/forwardToOrigin.js';
import { genericErrorResponse, logError } from './lib/logger.js';

// If the environment is not set to 'production', load environment variables from the .env file
if (process.env.NODE_ENV !== 'production') {
  // Dynamically import the 'dotenv' package to configure environment variables
  import('dotenv').then((dotenv) => {
    // Call the config method to load variables from the .env file into process.env
    dotenv.config();
  });
}

const defaultDependencies = {
  downloadsHandler,
  redirectsHandler,
  statusHandler,
  forwardToOrigin,
  logError,
  genericErrorResponse,
};

// Lambda handler function
export const handler = async (
  event,
  context,
  callback,
  dependencies = defaultDependencies
) => {
  // Note: callback is not used in this async/await function but must be specified as third argument before adding custom arguments
  const {
    downloadsHandler,
    redirectsHandler,
    statusHandler,
    forwardToOrigin,
    logError,
    genericErrorResponse,
  } = dependencies;

  try {
    // Extract the path from the event object
    const path = event.rawPath;

    // Check if the path is not present
    if (!path) {
      // If the path is missing, it means the function was not invoked via an HTTP request, so throw an error
      throw new Error('Missing required parameter(s) in Event JSON.');
    }

    // Check if the path matches Status endpoint
    if (path === '/v1/status') {
      // Delegate handling responsibility to its respective function
      return statusHandler(event);
    }

    // Check if the path matches Redirects endpoint
    if (path === '/v1/redirects/cv') {
      // Delegate handling responsibility to its respective function
      return await redirectsHandler(event);
    }

    // Check if the path matches Downloads endpoint
    if (path.startsWith('/v1/downloads/cv/')) {
      // Delegate handling responsibility to its respective function
      return await downloadsHandler(event);
    }

    // Forward the request to the origin server and destructure the return values
    const [returnResponse, originResponse] = await forwardToOrigin(event);

    // If a ready-to-return response is received from the function, return that response
    if (returnResponse) {
      return returnResponse;
    }

    // Otherwise, return the response received from the origin
    return originResponse;
  } catch (error) {
    // Log the error in the AWS ecosystem's database
    await logError('/', error);

    // Gracefully fail with a generic error response
    return genericErrorResponse;
  }
};
