// Define global fetch
/* global fetch */

// Import required local modules
import { genericErrorResponse, logError } from './logger.js';

// Function to forward the request to the origin server and handle the response
export const forwardToOrigin = async (event) => {
  // Build the URL to forward the request to the origin server
  const url = buildOriginRequest(event);

  try {
    // Make a fetch request to the origin server with the appropriate method, headers, and body
    const originResponse = await fetch(url, {
      method: event.requestContext?.http?.method ?? 'GET', // Use the HTTP method from the event or default to 'GET'
      headers: event.headers, // Use the headers from the event
      body: event.body, // Use the body from the event
      redirect: 'manual', // Set redirect to 'manual' to handle redirects manually
    });

    // Validate that the content type is JSON
    const contentType = originResponse.headers.get('content-type');
    if (contentType && contentType.includes('json')) {
      // Read the body as JSON and return the response
      const response = {
        statusCode: originResponse.status, // Set the status code from the origin response
        body: JSON.stringify(await originResponse.json()), // Convert the JSON response body to a string
        headers: {
          contentType, // Include the content type in the headers
        },
      };
      return [response, null]; // Return the response and null for originResponse
    }

    // Handle responses with non-JSON or empty content type
    if (event.rawPath === '/v1/redirects/cv') {
      // Delegate handling responsibility to the calling function
      return [null, originResponse]; // Return the originResponse only
    }

    // If the response is unexpected, throw an error
    throw new Error('An unexpected error was encountered from Origin.');
  } catch (error) {
    // Log the error in the AWS ecosystem's database
    // Note: This step is crucial because reaching this point suggests the origin server encountered an error,
    // potentially failing to log the specific details of the error itself.
    await logError(url, error);

    // Gracefully fail with a generic error response
    return [genericErrorResponse, null]; // Return the generic error response only
  }
};

// Function to build the URL based on the provided domain, path, and query string
export const buildOriginRequest = (event) => {
  // Retrieve the API origin domain from environment variables
  const apiOriginDomain = process.env.API_ORIGIN_DOMAIN;

  // Ensure the API Origin Domain is present
  if (!apiOriginDomain) {
    // Throw an error if it is missing
    throw new Error('Missing required environment variable.');
  }

  // Extract the raw path from the event object, or use an empty string if it's not present
  const rawPath = event.rawPath ?? '';

  // Build the URL to redirect the request to the origin server
  let url = `https://${apiOriginDomain}${rawPath}`;

  // If there is a query string, append it to the URL
  if (event.rawQueryString) {
    url += `?${event.rawQueryString}`;
  }

  // Return the constructed URL
  return url;
};
