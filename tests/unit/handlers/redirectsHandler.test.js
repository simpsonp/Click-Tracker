import { expect } from 'chai';

import { redirectsHandler } from '../../../src/handlers/redirectsHandler.js';
import { PROJECT_ROOT, readJsonFile } from '../../utils/testHelpers.js';

describe('redirectsHandler', () => {
  let validRequestEvent;
  let badRequestEvent;

  before(async () => {
    // Load events
    validRequestEvent = readJsonFile(
      PROJECT_ROOT + 'events/requests/redirects/success.json'
    );
    badRequestEvent = readJsonFile(
      PROJECT_ROOT + 'events/requests/redirects/bad.json'
    );
  });

  describe('request events', () => {
    it('should should be an object', async () => {
      expect(validRequestEvent).to.be.an('object');
      expect(badRequestEvent).to.be.an('object');
    });
  });

  describe('with a valid request', () => {
    it('should return redirect location to download URL', async () => {
      const result = await redirectsHandler(validRequestEvent);
      expect(result).to.be.an('object');
      expect(result.statusCode).to.equal(303);
      expect(result.headers).to.be.an('object');
      expect(result.headers.location).to.be.an('string');
    });
  });

  describe('with an invalid request', () => {
    it('should return the custom error response', async () => {
      const result = await redirectsHandler(badRequestEvent);

      expect(result).to.be.an('object');
      expect(result.statusCode).to.equal(400);

      expect(result.body).to.be.an('string');
      const responseBody = JSON.parse(result.body);
      expect(responseBody).to.be.an('object');

      expect(responseBody).to.have.property('errors');
      expect(responseBody.errors).to.have.property(0);
      expect(responseBody.errors[0]).to.have.keys('id', 'status', 'code');

      expect(result.headers).to.be.an('object');
      expect(result.headers).to.have.property(
        'contentType',
        'application/problem+json'
      );
    }).timeout(process.env.TEST_RUNNER_CUSTOM_TIMEOUT);
  });
});
