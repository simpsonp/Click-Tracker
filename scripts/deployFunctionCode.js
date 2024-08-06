/**
 * @module deployFunctionCode
 *
 * This module automates the deployment of AWS Lambda function code using the AWS CLI.
 *
 * The script performs the following steps:
 * 1. Loads environment variables from a `.env` file.
 * 2. Zips the function code from the `src` directory.
 * 3. Updates the Lambda function code with the zipped file.
 * 4. Deletes the zip file after the update.
 *
 * Environment variables:
 * - `LAMBDA_FUNCTION_NAME`: The name of the Lambda function to be updated.
 *
 * Example usage:
 * ```
 * node deployFunctionCode.js
 * OR
 * npm run deploy:code
 * ```
 *
 * Note: Ensure that the AWS CLI is installed and configured with the necessary permissions.
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

import {
  LambdaClient,
  UpdateFunctionCodeCommand,
} from '@aws-sdk/client-lambda';
import dotenv from 'dotenv';

async function deploy() {
  dotenv.config();

  console.log('Deployment started.');

  // Define the Lambda function name
  const functionName = process.env.LAMBDA_FUNCTION_NAME;
  console.log('\nLambda function name:', functionName);

  const zipFile = 'function-code.zip';

  // Zip the function code
  console.log('\nZipping function code...');
  execSync(`cd src && zip -r ../${zipFile} .`, { stdio: 'inherit' });
  // Note: not adding try-catch, since the script should exit if the zipping fails.
  // Initialize the AWS Lambda client
  const lambdaClient = new LambdaClient();

  // Update Lambda function code
  try {
    console.log('\nUpdating Lambda function code...');
    const functionCode = readFileSync(zipFile);
    const command = new UpdateFunctionCodeCommand({
      FunctionName: functionName,
      ZipFile: functionCode,
    });
    await lambdaClient.send(command);
    console.log('Lambda function code updated successfully.');
  } catch (error) {
    console.error('\nError updating Lambda function code:');
    console.error(error);
    // Note: Added try-catch, to continue with deleting the zip file.
  }

  // Delete the zip file
  console.log('\nDeleting the zip file...');
  execSync(`rm ${zipFile}`, { stdio: 'inherit' });

  console.log('\nDeployment complete.');
}

deploy();
