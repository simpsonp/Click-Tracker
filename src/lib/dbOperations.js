// Import AWS SDK modules for DynamoDB
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';

// Configure the DynamoDB client with the AWS region from environment variables.
const dynamoDBClientConfig = {
  region: process.env.AWS_REGION,
};

// If the environment is not set to 'production', configure the client to use the DynamoDB endpoint from environment variables.
if (process.env.NODE_ENV !== 'production') {
  // Set the endpoint to the local DynamoDB instance URL, if specified in the environment variables
  dynamoDBClientConfig.endpoint =
    process.env.LOCAL_DYNAMODB_ENDPOINT || undefined;
}

const client = new DynamoDBClient(dynamoDBClientConfig); // Create a new DynamoDB client instance with the specified AWS region from environment variables
const ddbDocClient = DynamoDBDocumentClient.from(client); // Create a DynamoDB Document Client instance from the DynamoDB client

// Function to read an item from the DynamoDB table
export const readItem = async (tableName, key) => {
  try {
    // Send a `GetCommand` to DynamoDB to retrieve an item based on the key
    const response = await ddbDocClient.send(
      new GetCommand({
        TableName: tableName,
        Key: key,
      })
    );
    return response.Item; // Return the retrieved item
  } catch (err) {
    // await logError(err); // Log any errors that occur using the `logError` function
    throw err; // Re-throw the error to handle it in the calling code
  }
};

// Function to write an item to the DynamoDB table
export const writeItem = async (tableName, item) => {
  try {
    // Send a `PutCommand` to DynamoDB to write an item to the table
    await ddbDocClient.send(
      new PutCommand({
        TableName: tableName,
        Item: item,
      })
    );
  } catch (err) {
    // await logError(err); // Log any errors that occur using the `logError` function
    throw err; // Re-throw the error to handle it in the calling code
  }
};

// Function to delete an item from the DynamoDB table
export const deleteItem = async (tableName, key) => {
  try {
    const params = {
      TableName: tableName,
      Key: key,
    };
    // Send a `DeleteCommand` to DynamoDB to delete an item based on the key
    await ddbDocClient.send(new DeleteCommand(params));
  } catch (err) {
    // await logError(err); // Log any errors that occur using the `logError` function
    throw err; // Re-throw the error to handle it in the calling code
  }
};
