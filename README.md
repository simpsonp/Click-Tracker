# Click Tracker Project

Welcome to the Click Tracker Project! This project showcases various backend implementations of a click tracking system to demonstrate diverse programming and software engineering skills.

## Overview

The Click Tracker project features multiple backend implementations, each located in a separate branch. These implementations serve the same core functionality: tracking interactions and handling various API endpoints such as redirects, downloads, and status checks. The project also includes error logging to different storage systems depending on the implementation.

### Key Implementations

1. **PHP Implementation**

   - **Branch**: [backend/php-vanilla](https://github.com/simpsonp/Click-Tracker/tree/backend/php-vanilla)
   - **Description**: A vanilla PHP implementation designed for the origin server, integrating with MySQL for error logging and using stored procedures for enhanced security.

2. **Cloudflare Workers Implementation**

   - **Branch**: [backend/cloudflare-workers](https://github.com/simpsonp/Click-Tracker/tree/backend/cloudflare-workers)
   - **Description**: A Cloudflare Workers implementation that handles redirects at the edge for faster response times, with requests forwarded to the origin server for error handling and other endpoints.

3. **AWS Lambda Implementation**
   - **Branch**: [backend/aws-lambda](https://github.com/simpsonp/Click-Tracker/tree/backend/aws-lambda)
   - **Description**: An AWS Lambda function handling various API endpoints, logging errors to DynamoDB, and forwarding unhandled requests to the origin server. This implementation leverages AWS infrastructure for scalable, serverless execution.

## Getting Started

To explore the different implementations of the Click Tracker project, follow the links to the respective branches. Each branch's README provides detailed instructions on setup, usage, and project structure.

## Future Enhancements

- **Frontend Integration**: A potential addition of a frontend interface to interact with the backend.
- **Additional Implementations**: Expansion to include more backend implementations using other frameworks or platforms.

## Contact

For any questions or further information, please feel free to contact me via [LinkedIn](https://www.linkedin.com/in/simpsonpaul-xyz/).
