import { exec as execCb } from 'child_process';
import { promisify } from 'util';

import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';

const LOCAL_DYNAMODB_ENDPOINT = process.env.LOCAL_DYNAMODB_ENDPOINT;

if (LOCAL_DYNAMODB_ENDPOINT) {
  const exec = promisify(execCb);

  const startDynamoDBLocal = async () => {
    // Stop and remove any existing container with the name "dynamodb-local"
    await exec('docker rm -f dynamodb-local || true', { cwd: process.cwd() });

    // Start the DynamoDB Local container
    await exec('docker compose -f docker/docker-compose.yml up -d', {
      cwd: process.cwd(),
    });

    // Wait for DynamoDB Local to be ready
    await waitForDynamoDBLocal();
  };

  const stopDynamoDBLocal = async () => {
    // Stop and remove the DynamoDB Local container
    await exec('docker compose -f docker/docker-compose.yml down', {
      cwd: process.cwd(),
    });
  };

  const waitForDynamoDBLocal = async (retries = 5, delay = 2000) => {
    const client = new DynamoDBClient({
      endpoint: process.env.LOCAL_DYNAMODB_ENDPOINT,
    });

    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Checking DynamoDB Local availability... Attempt ${i + 1}`);

        // Note: Using the `list-tables` command to test as this is the example given in this doc: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.UsageNotes.html
        // const execOutput = await exec(`aws dynamodb list-tables --endpoint-url ${LOCAL_DYNAMODB_ENDPOINT}`);
        // Note: Modified the command to list all tables and count them.
        // const execOutput = await exec(`aws dynamodb list-tables --endpoint-url ${LOCAL_DYNAMODB_ENDPOINT} --query "TableNames | length(@)"`);
        // if (execOutput.stderr) {
        //   throw new Error(`Exec error: ${execOutput.stderr}`);
        // }
        // console.log(`DynamoDB Local is ready. Found ${execOutput.stdout.replace('\n', '')} tables.`);

        // Send the command to DynamoDB
        const response = await client.send(new ListTablesCommand({}));
        const tableCount = response.TableNames.length;
        console.log(`DynamoDB Local is ready. Found ${tableCount} tables.`);
        return;
      } catch (error) {
        console.error('Error fetching DynamoDB Local:', error.message);
        if (i < retries - 1) {
          console.log(`Retrying in ${delay / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          console.error('DynamoDB Local failed to start in time');
          throw new Error('DynamoDB Local failed to start in time');
        }
      }
    }
  };

  before(async function () {
    this.timeout(10000); // Set timeout to 10 seconds
    // Start DynamoDB Local before tests
    await startDynamoDBLocal();
  });

  after(async function () {
    // Stop DynamoDB Local after tests
    await stopDynamoDBLocal();
  });
}
