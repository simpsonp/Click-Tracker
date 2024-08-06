# Cloudflare Workers Implementation for Click Tracker

## Table of Contents

- [Cloudflare Workers Implementation for Click Tracker](#cloudflare-workers-implementation-for-click-tracker)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [Project Structure](#project-structure)
  - [Usage](#usage)
  - [Getting Started](#getting-started)
    - [Installing Dependencies](#installing-dependencies)
    - [Running the Development Server](#running-the-development-server)
    - [Running Tests](#running-tests)
    - [Deploying to Production](#deploying-to-production)
  - [Configuration Details](#configuration-details)
  - [Additional Notes](#additional-notes)

## Overview

This project showcases a simple Cloudflare Workers implementation to handle redirect requests for the redirects endpoint of the parent project. The goal is to improve response times by leveraging Cloudflare's edge network. If an error occurs, the request is forwarded to the origin server (a PHP backend) for further handling.

## Key Features

- **Faster Response Times**: Processes redirect requests at the edge for faster response times.
- **Error Forwarding**: Forwards requests to the origin server if validation fails.
- **Workers Routes**: Utilises Cloudflare Workers Routes to map site URL pattern to the Worker.

## Project Structure

```plaintext
.
├── node_modules/                                 # Refer to npm documentation node_modules
├── src/
│   └── index.js                                  # Main entry point for the Cloudflare Worker
├── test/                                         # Directory containing unit and integration tests
├── .editorconfig                                 # Configuration file for maintaining consistent coding styles across editors
├── .gitignore                                    # Specifies files and directories to be ignored by Git
├── .prettierrc                                   # Prettier configuration file
├── package.json                                  # Project metadata, including dependencies, scripts, and configuration
├── package-lock.json                             # Refer to npm documentation on package-lock.json
├── README.md                                     # Project documentation
├── vitest.config.js                              # Vitest configuration file
└── wrangler.toml                                 # Wrangler configuration file
```

## Usage

For detailed usage instructions, please refer to the [README](https://github.com/simpsonp/Click-Tracker/blob/backend/php/README.md) of the PHP backend project. You can find it in the [backend/php branch](https://github.com/simpsonp/Click-Tracker/tree/backend/php) on GitHub. This documentation covers all necessary information for the origin server.

## Getting Started

### Installing Dependencies

```sh
npm install
```

### Running the Development Server

To start the development server, use one of the following commands:

```sh
npx wrangler dev
# OR
npm start
```

For more graceful error handling in the local development server in the staging environment, use:

```sh
npx wrangler dev --env staging
# OR
npm run dev
```

### Running Tests

To execute the test suite, run:

```sh
npm test
```

### Deploying to Production

To deploy the application to the production environment, use:

```sh
npx wrangler deploy
# OR
npm run deploy
```

To test the deployment in the staging environment before deploying it to production, use:

```sh
npx wrangler deploy --env staging
# OR
npm run deploy:staging
```

## Configuration Details

- `package.json`

  - Contains metadata about the project, including its dependencies, scripts, and other configuration information.

- `wrangler.toml`:

  - A [Wrangler](https://developers.cloudflare.com/workers/wrangler/) configuration file.
  - Specifies the settings for the Cloudflare Worker, including the main entry point, compatibility date, and routes.
  - Separate configurations for production and staging environments to manage different routes and settings.

## Additional Notes

- This project is focused solely on handling the `/v1/redirects/...` endpoint.
- It does not cover other endpoints managed by the origin server.
- The implementation ensures quick response times for redirects, enhancing overall performance.
