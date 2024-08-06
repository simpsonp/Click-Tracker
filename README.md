# Click Tracker Project

Welcome to the Click Tracker Project! This project is a simple PHP application designed to track various interactions and provide access to different types of resources. It handles various API endpoints, including redirects, downloads, and status checks, and logs errors to a MySQL table, with a fallback to file logging if the database connection fails. The project demonstrates integration with a MySQL database for logging purposes and uses MySQL stored procedures for enhanced security.

## Table of Contents

- [Click Tracker Project](#click-tracker-project)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Usage](#usage)
  - [Error Handling](#error-handling)
  - [Additional Notes](#additional-notes)

## Project Structure

```plaintext
.
├── api/
│   ├── cv-downloads-v1.php
│   ├── cv-redirects-v1.php
│   ├── logs.php
│   └── status.php
├── docs/
│   └── backend-database/
│       └── database-setup.sql
├── private/
│   ├── error_query_sample.log
│   ├── error_query.log
│   ├── error_sample.log
│   └── error.log
├── repository/
│   └── .gitignore
├── .gitignore
├── .htaccess
└── index.php
```

- **api/**: Contains PHP scripts for handling various API requests.

  - `cv-downloads-v1.php`: Manages download requests for CV-related resources.
  - `cv-redirects-v1.php`: Manages redirection requests for CV-related resources.
  - `logs.php`: Provides access to log files.
  - `status.php`: Returns the status of the application.

- **docs/backend-database/**: Contains SQL scripts for setting up the database.

  - `database-setup.sql`: Script for creating necessary database tables and stored procedures.

- **private/**: Contains private log files.

  - `error_query_sample.log`: Sample log of query errors for documentation purposes.
  - `error_query.log`: log for query errors.
  - `error_sample.log`: Sample log of general errors for documentation purposes.
  - `error.log`: log for general errors.

- **repository/**: Contains non-code assets, such as PDFs for the downloads API.

  - `.gitignore`: Ensures that only this file is tracked by Git, ignoring all others in this directory.

- **`.gitignore`**: Specifies files and directories to be ignored by Git.

- **`.htaccess`**: Configures Apache server settings, such as error handling and URL rewriting.

- **`index.php`**: The main entry point for the application.

## Getting Started

### Prerequisites

- A web server with PHP support (e.g., Apache).
- Basic knowledge of PHP and how to configure a web server.
- MySQL or MariaDB database.

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/simpsonp/click-tracker.git
   cd click-tracker
   ```

2. **Set Up The Server**:

   - Place the project in the web server's document root (e.g., `/var/www/html` for Apache).
   - Ensure that the server has PHP installed and configured.

3. **Configuration**:

   - Configure the web server to use `.htaccess` for URL rewriting.
   - Set appropriate permissions for the `private/` directory to ensure that log files can be written.

4. **Database Setup**

   The `docs/backend-database/database-setup.sql` file contains the SQL script to set up the necessary database tables and stored procedures for the project. This includes tables for logging events and errors, as well as stored procedures for inserting data into these tables.

   - **Use the SQL Script**:
     - Open the `database-setup.sql` file located in the `docs/backend-database/` directory.
     - Execute the SQL script in your MySQL or MariaDB database to create the required tables and procedures.

### Usage

- **Redirections**:

  - Use `api/v1/redirects/cv...` to follow links to external profiles or resources.

- **Downloads**:

  - Request files from `api/v1/downloads...` to download CVs or recommendation letters.
  - Ensure you have uploaded the files that you want to make available for download.

- **Logs**:

  - View log files using `api/logs/...`.
  - Ensure that you have the right access permissions.

- **Status**:

  - Check the application's status by accessing `api/status`.

## Error Handling

- If you encounter issues, error logs can be found in the `private/` directory. Check `error.log` and `error_query.log` for details.

## Additional Notes

- The `.gitignore` files ensure that sensitive or unnecessary files are not committed to the repository.
- The `.htaccess` file is used for URL rewriting and error handling in Apache.
- This project uses MySQL stored procedures for security and better handling of database operations.
