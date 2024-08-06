import '../../localDynamoDBSetup.js';

import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { expect } from 'chai';

import {
  deleteItem,
  readItem,
  writeItem,
} from '../../../src/lib/dbOperations.js';

describe('dbOperations', () => {
  let tableName;
  let item;
  let itemId;
  let key;

  before(function () {
    if (process.env.RUN_DB_TESTS !== 'TRUE') {
      this.skip();
      // This setup ensures that the database tests will only run when this env var is set to true, helping us avoid unnecessary costs.
    }

    // Retrieve the DynamoDB table name from environment variables
    tableName = process.env.LOGGER_TABLE_NAME;

    // Create the item to be stored in DynamoDB
    item = {
      Id: new Date().toISOString(), // Use timestamp as the ID
      ApiEndpoint: 'tests', // Specify the API endpoint
      ApiFullUrl: 'http://localhost/example/url', // Include the full URL of the request
      ErrorMessage: 'This is an error message.', // Include the error message
    };

    // Store the Item Id
    itemId = item.Id;

    // Create the key to be used for reading/deleting in DynamoDB
    key = {
      Id: itemId,
    };
  });

  describe('Before tests run', () => {
    it('should ensure table exists', async () => {
      const client = new DynamoDBClient({
        endpoint: process.env.LOCAL_DYNAMODB_ENDPOINT,
      });

      const command = new CreateTableCommand({
        TableName: tableName,
        // Note: Confirm AttributeName from SAM YAML
        AttributeDefinitions: [
          {
            AttributeName: 'Id',
            AttributeType: 'S',
          },
        ],
        KeySchema: [
          {
            AttributeName: 'Id',
            KeyType: 'HASH',
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      });

      const response = await client.send(command);

      expect(response.$metadata.httpStatusCode).to.equal(200);
    });
  });

  describe('writeItem', () => {
    it('should write item to the database', async () => {
      expect(await writeItem.bind(null, tableName, item)).to.not.throw();
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second after write operation, so that other operations (read, write) have lesser chance of failure.
    });
  });

  describe('readItem', () => {
    it('should read item from the database', async () => {
      try {
        const result = await readItem(tableName, key);
        expect(result).to.be.an('object');
      } catch (error) {
        expect.fail(error.message);
      }
    });
  });

  describe('deleteItem', () => {
    it('should delete item from the database', async () => {
      expect(await deleteItem.bind(null, tableName, key)).to.not.throw();
    });
  });
});
