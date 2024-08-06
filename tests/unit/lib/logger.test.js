import { expect } from 'chai';

import { genericErrorResponse, logError } from '../../../src/lib/logger.js';

describe('logger', () => {
  describe('logError', () => {
    it('should log an error', async () => {
      const error = new Error('Test error');
      const request = 'http://localhost/example/url';

      // Create a mock dbHandler
      const dbHandlerMock = {
        async writeItem(_tableName, _item) {
          Promise.resolve();
        },
      };

      const result = await logError(request, error, dbHandlerMock);
      expect(result, 'should return nothing').to.be.undefined;
      expect(result, 'should not return error').not.to.be.instanceOf(Error);
    });
  });

  describe('genericErrorResponse', () => {
    it('should have statusCode 500', () => {
      expect(genericErrorResponse.statusCode).to.equal('500');
    });

    it('should have a statusDescription', () => {
      expect(genericErrorResponse.statusDescription).to.be.an('string');
    });

    it('should have a body containing an error message', () => {
      const body = JSON.parse(genericErrorResponse.body);
      expect(body).to.be.an('object');
      expect(body.error).to.be.an('string');
    });
  });
});
