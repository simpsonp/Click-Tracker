// Import required modules
import { buildOriginRequest } from '../lib/forwardToOrigin.js';

// Downloads handler function
export const downloadsHandler = async (event) => {
  // Build the URL to redirect the request to the origin server
  const url = buildOriginRequest(event);

  // Create a response object to return the redirect location
  const response = {
    statusCode: 303, // HTTP status code for "See Other" (redirection)
    headers: {
      location: url, // Set the Location header to the constructed URL
    },
  };

  // Return the response object
  return response;

  // TODO: Replace with logic to use AWS S3 bucket for downloadable files
  // Note: Currently, it is simply redirecting to the origin/backup server to handle the logic
  // because free S3 buckets are not available.
};
