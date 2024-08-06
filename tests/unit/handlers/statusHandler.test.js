import { expect } from 'chai';

import { statusHandler } from '../../../src/handlers/statusHandler.js';

describe('statusHandler', () => {
  it('should return status OK', () => {
    const result = statusHandler();
    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an('string');
    const responseBody = JSON.parse(result.body);
    expect(responseBody).to.be.an('object');
    expect(responseBody.status).to.be.equal('OK');
  });
});
