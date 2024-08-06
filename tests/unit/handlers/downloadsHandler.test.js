import { expect } from 'chai';

import { downloadsHandler } from '../../../src/handlers/downloadsHandler.js';
import { PROJECT_ROOT, readJsonFile } from '../../utils/testHelpers.js';

describe('downloadsHandler', () => {
  let validRequestEvent;
  let badRequestEvent;

  before(async () => {
    // Load events
    validRequestEvent = readJsonFile(
      PROJECT_ROOT + 'events/requests/downloads/success.json'
    );
    badRequestEvent = readJsonFile(
      PROJECT_ROOT + 'events/requests/downloads/bad.json'
    );
  });

  describe('with a valid request', () => {
    it('should return redirect location to download URL', async () => {
      const result = await downloadsHandler(validRequestEvent);
      expect(result).to.be.an('object');
      expect(result.statusCode).to.equal(303);
      expect(result.headers).to.be.an('object');
      expect(result.headers.location).to.be.an('string');
    });
  });

  describe('with an invalid request', () => {
    it('should still return redirect location to download URL', async () => {
      const result = await downloadsHandler(badRequestEvent);
      expect(result).to.be.an('object');
      expect(result.statusCode).to.equal(303);
      expect(result.headers).to.be.an('object');
      expect(result.headers.location).to.be.an('string');
    });
  });
});
