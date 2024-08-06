// Import required modules
import { forwardToOrigin } from '../lib/forwardToOrigin.js';
import { genericErrorResponse, logError } from '../lib/logger.js';

// Redirects handler function
export const redirectsHandler = async (event) => {
  try {
    // Get the query parameters in an array from the event
    const getParams = event.queryStringParameters ?? [];

    // Validate the request parameters against predefined rules
    const validationStatus = validateRequest(getParams, redirectMap);

    if (validationStatus === 200) {
      // If validation is successful, forward the request to the origin server for logging info (analytics)
      // TODO: Implement asynchronous handling to forward requests without blocking responses, ensuring TTL is preserved.

      // Return a successful response with redirect location
      return sendSuccessResponse(redirectMap[getParams.to]);
    }

    // If validation fails, forward the request to the origin server for further handling
    const [returnResponse, originResponse] = await forwardToOrigin(event);

    // If an error response is received from the origin server, return that error
    if (returnResponse) {
      return returnResponse;
    }

    // Get the Location header from the origin response headers for redirection
    const location = originResponse.headers.get('location');

    // Ensure a location header is present; its absence indicates a potential error.
    if (!location) {
      throw new Error('Location header not found.');
    }

    // Return the received successful redirect location
    const response = {
      statusCode: originResponse.status, // Set the status code from the origin response
      body: await originResponse.text(), // Get the response body as text
      headers: {
        location: location, // Include the location header for redirection
      },
    };
    return response;
  } catch (error) {
    // Log the error in the AWS ecosystem's database.
    // Note: This step is crucial because reaching this point suggests the origin server encountered an error,
    // potentially failing to log the specific details of the error itself.
    await logError(url, error);

    // Gracefully fail with a generic error response
    return genericErrorResponse;
  }
};

// A mapped list of redirect locations
export const redirectMap = {
  linkedin: 'https://www.linkedin.com/in/simpsonpaul-xyz/', // LinkedIn profile
  'portfolio-site': 'https://simpsonpaul.com', // Personal website
  github: 'https://github.com/simpsonp', // GitHub profile
  postman: 'https://explore.postman.com/simpsonp', // Postman profile
  // TODO: Remove the above sample demo values before deploying to production.
  // NOTE/TODO: REDACTED. Remove the below production list before pushing code to public repository.
};

// Function to validate the request parameters against predefined rules
export const validateRequest = (getParams, redirectMap) => {
  const requestValidationArguments = {
    v: '^2020(05|06|10|11)-[1]$',
    from: 0,
    to: 0,
  };

  const validFromValues = new Set([
    'linkedin', // linkedin
    'indeed', // indeed
    'naukri', // naukri
    'siteapi', // site api
    'postmandocs', // postman documentations
    // TODO: Remove the above sample demo values before deploying to production.
    // NOTE/TODO: REDACTED. Remove the below production list before pushing code to public repository.
  ]);

  // Check if there are no query parameters
  if (getParams.length === 0) {
    return 4101; // No query parameters found
  }

  // Check for any invalid query parameters
  if (
    Object.keys(getParams).some(
      (param) => !(param in requestValidationArguments)
    )
  ) {
    return 4102; // Invalid query parameters found
  }

  // Check if any required query parameters are missing
  if (
    Object.keys(requestValidationArguments).some(
      (param) => !(param in getParams)
    )
  ) {
    return 4103; // Required query parameters missing
  }

  // Check if version parameter has a valid value
  // let patt = new RegExp(requestValidationArguments.v);
  // if (!patt.test(getParams.v)) {
  //   return 4104 // Invalid version parameter
  // }

  // Check if 'from' parameter has a valid value
  if (!validFromValues.has(getParams.from)) {
    return 4211; // Invalid 'from' parameter
  }

  // Check if 'to' parameter has a valid value
  if (!(getParams.to in redirectMap)) {
    return 4212; // Invalid 'to' parameter
  }

  return 200; // Validation successful
};

// Function to send a success response with redirect location
export const sendSuccessResponse = (toValue) => {
  let body =
    'redirecting... hmm... you should have been redirected automatically. No worries.';
  body += `<br>Click here: <a href='${toValue}'>${toValue}</a>`;
  body += '<br>Error Code: 3103';

  const response = {
    statusCode: 303,
    statusDescription: 'redirecting...',
    headers: {
      'content-type': 'text/html',
      location: toValue,
    },
    body: body,
  };
  return response;
};
