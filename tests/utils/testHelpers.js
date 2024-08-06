import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Function to get the directory name of the current module
 * @param {import.meta.url} metaUrl - The meta URL of the current module
 * @returns {string} The directory name
 */
export const getDirName = (metaUrl) => {
  const __filename = fileURLToPath(metaUrl);
  return dirname(__filename);
};

// Since the __dirname variable is not available in ES6 modules
// Convert import.meta.url to __dirname equivalent
const __dirname = getDirName(import.meta.url);

export const PROJECT_ROOT = __dirname + '/../../';

/**
 * Function to read a JSON file and parse its content
 * @param {string} filePath - The path to the JSON file
 * @returns {Object} The parsed JSON content
 */
export const readJsonFile = (filePath) => {
  // Note: Use of the `import` statement with a `with` clause for JSON files isn't part of the ES6 specification and isn't supported by many JavaScript environments.
  // Hence using `fs` to read JSON files. Avoid using Dynamic Imports also.

  try {
    const fileContents = readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return error;
  }
};
