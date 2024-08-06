import { expect } from 'chai';

import {
  buildOriginRequest,
  forwardToOrigin,
} from '../../../src/lib/forwardToOrigin.js';
// import { genericErrorResponse } from '../../../src/lib/logger.js';
import { PROJECT_ROOT, readJsonFile } from '../../utils/testHelpers.js';

describe('forwardToOrigin', () => {
  let validRedirectRequestEvent;
  let invalidRedirectRequestEvent;
  let invalidEvent;

  before(async () => {
    // Load events
    validRedirectRequestEvent = readJsonFile(
      PROJECT_ROOT + 'events/requests/redirects/success.json'
    );
    invalidRedirectRequestEvent = readJsonFile(
      PROJECT_ROOT + 'events/requests/redirects/bad.json'
    );
    invalidEvent = readJsonFile(
      PROJECT_ROOT + 'events/invalid-payloads/empty.json'
    );
  });

  describe('request events', () => {
    it('should be an object', async () => {
      expect(validRedirectRequestEvent).to.be.an('object');
      expect(invalidRedirectRequestEvent).to.be.an('object');
      expect(invalidEvent).to.be.an('object');
    });
  });

  describe('forwardToOrigin', () => {
    it('with a valid redirect request event, should return the request from the origin', async () => {
      const [returnResponse, originResponse] = await forwardToOrigin(
        validRedirectRequestEvent
      );
      expect(returnResponse).to.be.an('null', 'returnResponse should be null');
      expect(
        originResponse,
        'originResponse should be instance of Response'
      ).to.be.instanceOf(Response);
    });

    it('with an invalid redirect request event, should return the error from the origin', async () => {
      const [returnResponse, originResponse] = await forwardToOrigin(
        invalidRedirectRequestEvent
      );
      expect(originResponse).to.be.an('null', 'originResponse should be null');
      expect(returnResponse, 'returnResponse should be an object').to.be.an(
        'object'
      );
    });

    it('with an invalid event, should return genericErrorResponse (TODO)', async () => {
      const [, originResponse] = await forwardToOrigin(invalidEvent);
      expect(originResponse).to.be.an('null', 'originResponse should be null');
      // Note: A test to check for an unexpected error is not implemented, since all potential errors have been handled.
      // TODO: Re-check if can test for a situation where the function will return genericErrorResponse
      // expect(returnResponse, 'returnResponse should be genericErrorResponse').to.equal(genericErrorResponse);
    });
  });

  describe('buildOriginRequest', () => {
    let originalEnv;

    beforeEach(() => {
      // Backup the original environment variables
      originalEnv = { ...process.env };
    });

    afterEach(() => {
      // Restore the original environment variables after each test
      process.env = originalEnv;
    });

    it('should throw an error if API_ORIGIN_DOMAIN is not set', () => {
      // Remove the environment variable if it exists
      delete process.env.API_ORIGIN_DOMAIN;

      const event = {
        rawPath: '/test',
        rawQueryString: 'param=value',
      };

      expect(() => buildOriginRequest(event)).to.throw(
        'Missing required environment variable.'
      );
    });

    it('should build the URL with a path and without a query string', () => {
      process.env.API_ORIGIN_DOMAIN = 'api.example.com';

      const event = {
        rawPath: '/test',
      };
      const expectedUrl = 'https://api.example.com/test';

      const url = buildOriginRequest(event);

      expect(url).to.equal(expectedUrl);
    });

    it('should build the URL with a path and query string', () => {
      process.env.API_ORIGIN_DOMAIN = 'api.example.com';

      const event = {
        rawPath: '/test',
        rawQueryString: 'param=value',
      };
      const expectedUrl = 'https://api.example.com/test?param=value';

      const url = buildOriginRequest(event);

      expect(url).to.equal(expectedUrl);
    });

    it('should build the URL without a path nor a query string', () => {
      process.env.API_ORIGIN_DOMAIN = 'api.example.com';

      const event = {};
      const expectedUrl = 'https://api.example.com';

      const url = buildOriginRequest(event);

      expect(url).to.equal(expectedUrl);
    });

    it('should build the URL without a path and with query string', () => {
      process.env.API_ORIGIN_DOMAIN = 'api.example.com';

      const event = {
        rawQueryString: 'param=value',
      };
      const expectedUrl = 'https://api.example.com?param=value';

      const url = buildOriginRequest(event);

      expect(url).to.equal(expectedUrl);
    });
  });
});
