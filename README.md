# AWS Lambda Implementation for Click Tracker

## Table of Contents

- [AWS Lambda Implementation for Click Tracker](#aws-lambda-implementation-for-click-tracker)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [Project Structure](#project-structure)
  - [Usage](#usage)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
    - [Install Dependencies](#install-dependencies)
    - [Environment Variables](#environment-variables)
    - [Deployment](#deployment)
    - [Updating Lambda Function Code](#updating-lambda-function-code)
    - [Uploading Test Events](#uploading-test-events)
      - [Alternative Method](#alternative-method)
    - [Running Unit Tests](#running-unit-tests)
    - [Local DynamoDB Setup](#local-dynamodb-setup)
  - [Scripts](#scripts)
    - [`deployFunctionCode.js`](#deployfunctioncodejs)
    - [`deployTestEvents.js`](#deploytesteventsjs)
  - [Configuration Files](#configuration-files)
    - [`package.json`](#packagejson)
    - [`.npmrc`](#npmrc)
    - [`.env.example`](#envexample)
    - [Deployment Configuration Files](#deployment-configuration-files)
      - [`template.yaml`](#templateyaml)
      - [`deploy.yml`](#deployyml)
      - [`samconfig.toml`](#samconfigtoml)
    - [Testing Configuration Files](#testing-configuration-files)
      - [`.mocharc.jsonc`](#mocharcjsonc)
      - [`docker/docker-compose.yml`](#dockerdocker-composeyml)
      - [`template-lambda-testevent-schemas.yaml`](#template-lambda-testevent-schemasyaml)
    - [`.prettierrc`](#prettierrc)
    - [`eslint.config.js`](#eslintconfigjs)
    - [`.vscode/extensions.json`](#vscodeextensionsjson)
  - [Testing](#testing)
    - [Test Event Files](#test-event-files)
    - [Unit Tests](#unit-tests)
    - [Testing with Local DynamoDB](#testing-with-local-dynamodb)
  - [Lambda Function Code](#lambda-function-code)
    - [API Handlers](#api-handlers)
    - [Logging](#logging)
  - [Additional Notes](#additional-notes)

## Overview

This project features an AWS Lambda function designed to handle various API endpoints, including redirects, downloads, and status checks. It logs errors to a DynamoDB table and forwards unhandled requests to an origin server. The project includes the implementation of multiple handlers for these functionalities and demonstrates integration with AWS DynamoDB for logging purposes.

Additionally, the project is equipped with the necessary setup for local development, including unit tests, deployment scripts, and local DynamoDB configuration. This ensures a comprehensive development environment for effective testing and deployment.

## Key Features

- **Node.js Implementation**: Leverages Node.js for efficient and flexible function development.
- **AWS Lambda Integration**: Deployed as a serverless function for cost-effective and scalable execution.
- **DynamoDB Error Logging**: Utilizes DynamoDB to record errors for analysis and troubleshooting.
- **Modular Structure**: Organizes code into well-defined handlers for better maintainability.
- **Comprehensive Testing**: Includes unit tests and local development environment support for thorough validation.

## Project Structure

```plaintext
.
├── .vscode/
│   ├── extensions.json                           (VS Code extensions recommendations)
│   └── launch.json                               (VS Code configuration for debugging)
├── docker/
│   ├── dynamodb/
│   └── docker-compose.yml                        (configuration for local DynamoDB instance)
├── events/                                       (sample test event files)
│   ├── invalid-payloads/                         (sample invalid request payloads for testing)
│   └── requests/
│       ├── downloads/                            (sample download request events)
│       ├── redirects/                            (sample redirect request events)
│       └── status/                               (sample status check request events)
├── scripts/
│   ├── deployFunctionCode.js                     (script to deploy/update Lambda function code)
│   └── deployTestEvents.js                       (script to upload test events to AWS)
├── src/                                          (source code for the Lambda function)
│   ├── handlers/                                 (request handler modules)
│   ├── lib/                                      (utility library modules)
│   ├── index.js                                  (entry point of the Lambda function)
│   └── package.json                              (separate package.json specifically for Lambda function)
├── tests/                                        (tests for the Lambda function)
│   ├── unit/                                     (unit test files)
│   ├── utils/                                    (utility functions for tests)
│   ├── localDynamoDBSetup.js                     (script for local DynamoDB setup for tests)
│   └── setup.js                                  (test setup script)
├── .env
├── .env.example
├── .gitignore
├── .mocharc.jsonc
├── .npmrc
├── .prettierrc
├── deploy.yml
├── eslint.config.js
├── package-lock.json
├── package.json
├── README.md
├── samconfig.toml
├── template-lambda-testevent-schemas.yaml
└── template.yaml
```

## Usage

Invoke the Lambda function using the appropriate API endpoint:

- `/status`: Checks the service status.
- `/v1/redirects/...`: Handles redirect requests.
- `/v1/downloads/...`: Handles download requests.

## Prerequisites

- AWS CLI
- AWS SAM CLI
- Node.js (runtime version as defined in the SAM template)
- Docker (optional)
- VS Code (optional)
- VS Code Extension "AWS Toolkit for Visual Studio Code" (optional)

## Setup

### Install Dependencies

```bash
npm install
```

### Environment Variables

Copy the `.env.example` file to `.env` and update the values as needed.

```bash
cp .env.example .env
```

### Deployment

Build and deploy the resources defined in the SAM template with SAM CLI.

```bash
sam build
sam deploy --guided
```

A sample `samconfig.toml` file is provided; update the values as needed.

### Updating Lambda Function Code

Run the following script to deploy or update the Lambda function code.

```bash
node scripts/deployFunctionCode.js
# OR
npm run deploy:code
```

For more details, see [`deployFunctionCode.js`](#deployfunctioncodejs).

### Uploading Test Events

You can upload shareable test events to the Lambda function in the AWS Cloud with AWS SAM CLI `sam remote test-event put` command.  
Run the following script to deploy test events.

```bash
node scripts/deployTestEvents.js
# OR
npm run deploy:test-events
```

For more details, see [`deployTestEvents.js`](#deploytesteventsjs) and [Test Event Files](#test-event-files).

#### Alternative Method

Alternatively, an AWS SAM Template file can be used to create and deploy shareable test events for the Lambda function.  
`template-lambda-testevent-schemas.yaml` is a separate YAML file provided as a sample specifically for test events with only a few example test events; update the values as needed.  
Can be deployed with SAM CLI.

```bash
sam deploy --template-file template-lambda-testevent-schemas.yaml
```

_Additional Notes_

- After considering the dynamic creation of a SAM template file for defining and deploying Lambda function test events with EventSchemas, it was found to be cumbersome and prone to errors. Instead, it is recommended to use the provided script that leverages the AWS SAM CLI. This approach is preferable because adding new events individually to the event schema and redeploying can overwrite all existing shareable test events in the AWS Cloud and delete any manually created ones.

### Running Unit Tests

Run the unit tests using Mocha.

```bash
npm test
```

For the Mocha configuration, refer to the [`.mocharc.jsonc`](#mocharcjsonc) file.
For more details, see [Unit Tests](#unit-tests).

### Local DynamoDB Setup

Using DynamoDB Local, applications can be developed and tested without accessing the DynamoDB web service. However, currently, it is only configured for use in testing. Adding support for local development is in the backlog and will be addressed in the future.

Start the DynamoDB Local instance using Docker Compose.

```bash
docker compose -f docker/docker-compose.yml up -d
```

Note: When running unit tests, this will be set up automatically. For more details, see [Testing with Local DynamoDB](#testing-with-local-dynamodb).

## Scripts

### `deployFunctionCode.js`

This script handles the deployment/updation of the Lambda function code by zipping the function code and using the AWS SDK to update the Lambda function.

### `deployTestEvents.js`

This script automates the deployment/upload of multiple shareable test events from local JSON files to the Lambda function in the AWS Cloud. This is useful for testing in the Lambda console using the same events as those used locally.

## Configuration Files

### `package.json`

The `package.json` file is essential for managing the Node.js project's dependencies, scripts, and metadata. This project uses two `package.json` files:

1. **Root `package.json`:**

   - Contains the main project dependencies, scripts for deployment, testing, and other project-level configurations.
   - Example scripts include `deploy:code`, `deploy:test-events`, and `test`.
   - Manages project-wide dependencies like AWS SDK, Mocha for testing, and other utilities.

2. **`src/package.json`:**

   - Contains `"type": "module"` to ensure the Lambda function recognises the ES module format.
   - This setup is necessary because when the Lambda function is deployed, only the src folder is deployed, which does not include the root package.json with "type": "module". Without this, the Lambda function will encounter errors related to ES modules.
   - Adding a package.json in the src folder specifically for "type": "module" ensures that the Lambda function recognises the ES module format, while the main project configuration remains unaffected.

### `.npmrc`

The `.npmrc` file is used to configure npm settings.

In this project, it includes a configuration to enforce strict engine checks.

### `.env.example`

The `.env.example` file serves as a template for the environment variables used in the project. This file is essential for local development and testing, allowing you to define and manage environment-specific configurations.

In a production environment, the variables for the Lambda function are set via the SAM template. After deployment, these variables can also be updated directly from the Lambda console.

### Deployment Configuration Files

#### `template.yaml`

The SAM template defines all the AWS resources required for the project, including:

- Lambda Function
- DynamoDB Table
- IAM Role
- CloudFront Distribution
- Other resources such as Lambda Alias, Lambda Version, Lambda URLs, Lambda Permissions, Lambda EventInvokeConfig, and more.

This comprehensive definition ensures that all related infrastructure is managed and deployed together.

#### `deploy.yml`

The `deploy.yml` file is used to define the parameters and configurations for deploying your AWS resources using AWS SAM CLI. It includes paths to the template file and other parameters that control the deployment process.

#### `samconfig.toml`

The `samconfig.toml` file stores configuration settings for AWS SAM CLI commands. It simplifies repeated deployments by saving parameters used in `sam build`, `sam deploy`, and other SAM CLI commands.

### Testing Configuration Files

#### `.mocharc.jsonc`

Mocha configuration file to set up the local testing environment.

#### `docker/docker-compose.yml`

Docker Compose configuration to set up a local DynamoDB instance for testing purposes.

#### `template-lambda-testevent-schemas.yaml`

SAM template to define and update the Lambda test event schemas.

For more details, see [Uploading Test Events - Alternative Method](#alternative-method).

### `.prettierrc`

This project uses Prettier to automatically format code to maintain a consistent style.

### `eslint.config.js`

This project uses ESLint to enforce code quality and consistency by applying a set of rules, including those recommended for Node.js projects and Prettier for formatting.

### `.vscode/extensions.json`

The VS Code configuration includes a list of recommended extensions that help with development, such as tools for AWS, ESLint, and Prettier. These extensions provide features like syntax highlighting, linting, and code formatting directly in the VS Code editor.

## Testing

### Test Event Files

Test event files, stored in the `events/` directory, are used for testing the Lambda function both locally and remotely. These files can be utilised with the AWS SAM CLI or AWS Toolkit for Visual Studio.

- **Local Testing:** Use `sam local invoke` to test the Lambda function locally with the defined test events.
  - Example: `sam local invoke --event events/requests/status/success.json`
- **Remote Testing:** Use `sam remote invoke` to test the Lambda function remotely with the defined test events.
  - Example: `sam remote invoke --event-file events/requests/status/success.json`
  - Example: `sam remote invoke --test-event-name requests--status--success`
- **AWS Toolkit Testing:** Use the `launch.json` file in the `.vscode/` directory with sample events for testing with the AWS Toolkit. Refer to the [AWS Toolkit for Visual Studio Code documentation](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/serverless-apps-run-debug-config-ref.html) for editing debug configurations.

### Unit Tests

Unit tests are located in the `tests/unit/` directory and cover different modules of the Lambda function.  
These tests use the [Test Event Files](#test-event-files) and a [Local DynamoDB Setup](#local-dynamodb-setup).  
Note that database tests run only if the environment variable `RUN_DB_TESTS` is set to `TRUE`.

### Testing with Local DynamoDB

The `tests/localDynamoDBSetup.js` script is used to set up and configure DynamoDB Local for local testing.  
For Docker configuration, refer to the [`docker/docker-compose.yml`](#dockerdocker-composeyml) file.  
Note that this local database setup is activated only if the environment variable `LOCAL_DYNAMODB_ENDPOINT` is set with a valid endpoint, with the default being `http://localhost:8000`.

## Lambda Function Code

### API Handlers

- **Redirects Handler:** The `redirectsHandler` function validates incoming requests and forwards them to the origin server if necessary. It returns a redirect location if the request is valid.
- **Downloads Handler:** The `downloadsHandler` function builds a URL to redirect the request to the origin server. This function can be extended to handle file downloads from an S3 bucket.
- **Status Handler:** The `statusHandler` function checks the status of the service and returns a 200 OK response.

### Logging

- **Error Logging:** The `logError` function logs errors to the DynamoDB table specified by the `LOGGER_TABLE_NAME` environment variable.
- **Info Logging:** If validation is successful, the request is forwarded to the origin server for logging usage for analytics.

## Additional Notes

- Ensure that AWS CLI is configured properly for deploying the function and test events. Refer to [AWS CLI documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) for configuring the AWS CLI.
- Ensure that the credentials configured in AWS CLI have the necessary permissions to deploy the stack resources. To the best of my knowledge, at present, there is no straightforward method to determine the exact permissions required for deploying resources using AWS SAM CLI.
- After deployment, delete the S3 bucket to avoid potential charges.
- For JavaScript unit testing, ES Modules cannot be stubbed, so dependency injection is used.
- `npm start` is not defined with `sam local start-api` subcommand since it cannot be used due to the lack of an API Gateway configuration. Use AWS SAM CLI `sam local invoke` subcommand for invoking the Lambda function directly.
- Ensure you have pulled the Docker image `amazon/dynamodb-local` before running tests to avoid timeout.
- As additional steps, you can use an alternative domain name for custom domains. This requires manual actions such as updating DNS records in an external DNS registrar when creating SSL certificates in AWS SSL Store.
