export default {
  // Triggered when a fetch request is received
  async fetch(request, env, ctx) {
    const urlObject = new URL(request.url); // Parse the URL of the request
    const getParams = Object.fromEntries(urlObject.searchParams); // Object to store query parameters

    // Validate the request parameters against predefined rules
    const validationStatus = validateRequest(getParams, redirectMap);

    if (validationStatus === 200) {
      // If validation is successful
      // Forward the request to the origin server for logging info (analytics)
      ctx.waitUntil(fetch(request.url));
      // Return a successful response with redirect location
      return sendSuccessResponse(redirectMap[getParams.to]);
    }
    // If validation fails
    // Forward the request to the origin server for further handling and return the received response
    if (env.ENVIRONMENT === 'production') {
      return await fetch(request);
    }
    // If the environment is not production, send a generic response.
    const body =
      'Request validation failed. Processing stopped. On production, the request will be to the origin server for further handling and will return the received response.';
    const init = {
      status: 400,
      statusText: 'Error',
    };
    return new Response(body, init);
  },
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
    v: '^2020(05|06|10|11)-[1]$', // Version parameter
    from: 0, // 'from' parameter
    to: 0, // 'to' parameter
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
  if (Object.keys(getParams).length === 0) {
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
  // Construct the response body
  let body =
    'redirecting... hmm... you should have been redirected automatically. No worries.';
  body += `<br>Click here: <a href='${toValue}'>${toValue}</a>`;
  body += '<br>Error Code: 3103';

  // Response initialization object
  const init = {
    status: 303, // HTTP status code for redirection
    statusText: 'redirecting...', // Status text
    headers: {
      location: toValue, // Redirect location
      'content-type': 'text/html', // Content type of the response
    },
  };
  // Create and return the response object
  return new Response(body, init);
};
