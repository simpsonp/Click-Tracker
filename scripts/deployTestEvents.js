/**
 * @module deployTestEvents
 *
 * This module automates the deployment of test events to an AWS Lambda function using the AWS SAM CLI.
 *
 * Test events are defined in JSON files located in a specified directory. This script reads those files and
 * uses the `sam remote test-event put` command to deploy each test event to the Lambda function's web console.
 *
 * Example Command:
 * ```
 * sam remote test-event put FUNCTION_NAME_HERE --name demo-event --file events/requests/demo/example.json --force
 * ```
 *
 * This automation is particularly useful for continuous integration and testing environments where
 * deploying test events programmatically can streamline the development workflow.
 */

import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

import { GetFunctionCommand, LambdaClient } from '@aws-sdk/client-lambda';
import dotenv from 'dotenv';

import { PROJECT_ROOT } from '../tests/utils/testHelpers.js';

async function deploy() {
  dotenv.config();

  // Define the Lambda function name
  const functionName = process.env.LAMBDA_FUNCTION_NAME;
  console.log('Lambda function name:', functionName);

  // Confirm the given function exists
  try {
    const client = new LambdaClient();
    const command = new GetFunctionCommand({ FunctionName: functionName });
    const output = await client.send(command);

    console.log('Function description:', output.Configuration.Description);
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      console.error('\nError: Function does not exist.');
    } else {
      console.error('\nError checking function:', error);
    }
    // eslint-disable-next-line node/no-process-exit
    process.exit();
  }

  // Define the directory containing the test event JSON files
  const testEventsDir = join(PROJECT_ROOT, 'events');
  console.log('\nTest events directory:', testEventsDir);

  // Recursive function to get all .json files and generate event names
  function getJsonFiles(dir, baseDir) {
    let jsonFiles = [];

    const files = readdirSync(dir);
    files.forEach((file) => {
      const fullPath = join(dir, file);
      if (statSync(fullPath).isDirectory()) {
        jsonFiles = jsonFiles.concat(getJsonFiles(fullPath, baseDir));
      } else if (fullPath.endsWith('.json')) {
        const relativePath = relative(baseDir, fullPath);
        const eventName = relativePath
          .replace(/\.json$/, '')
          .replace(/[\/\\]/g, '--');
        jsonFiles.push({ fullPath, eventName });
      }
    });

    return jsonFiles;
  }

  const testEventFiles = getJsonFiles(testEventsDir, testEventsDir);

  // Deploy each test event
  testEventFiles.forEach(({ fullPath, eventName }) => {
    try {
      console.log('\nDeploying test event:', eventName);
      execSync(
        `sam remote test-event put ${functionName} --name ${eventName} --file ${fullPath} --force`,
        {
          stdio: 'inherit',
        }
      );
      console.log('Successfully deployed.');
    } catch (error) {
      console.error('Failed to deploy test event:', eventName);
      console.error(error);
    }
  });

  console.log('\nTest events deployment complete.');
}

deploy();
