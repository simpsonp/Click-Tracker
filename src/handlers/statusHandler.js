// Handles status query which confirms there are no issues with all endpoints.
export const statusHandler = () => {
  // TODO: This is a temporary code. Later, add checks to verify if the Lambda function has the necessary permissions,
  // such as database permissions, and check if required environment variables are set.

  // Return response with status code 200 indicating that the service is running fine.
  return {
    statusCode: 200, // HTTP status code 200 means OK.
    body: JSON.stringify({
      status: 'OK', // Response body containing the status message.
    }),
  };
};
