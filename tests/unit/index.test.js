import { expect } from 'chai';
import sinon from 'sinon';

import { handler } from '../../src/index.js';

describe('Lambda Handler', () => {
  const context = null;
  const callback = null;
  let dependencies;
  let downloadsHandlerStub;
  let redirectsHandlerStub;
  let statusHandlerStub;
  let forwardToOriginStub;
  let logErrorStub;

  beforeEach(() => {
    // Stub dependencies
    downloadsHandlerStub = sinon.stub();
    redirectsHandlerStub = sinon.stub();
    statusHandlerStub = sinon.stub();
    forwardToOriginStub = sinon.stub();
    logErrorStub = sinon.stub();

    // Create handler with mocked dependencies
    dependencies = {
      downloadsHandler: downloadsHandlerStub,
      redirectsHandler: redirectsHandlerStub,
      statusHandler: statusHandlerStub,
      forwardToOrigin: forwardToOriginStub,
      logError: logErrorStub,
      genericErrorResponse: {
        statusCode: '500',
        statusDescription: 'Unexpected Error',
        body: JSON.stringify({ error: 'An unexpected error was encountered.' }),
      },
    };
  });

  it('should return status handler response for /v1/status path', async () => {
    const event = {
      rawPath: '/v1/status',
    };
    const expectedResponse = {
      statusCode: 200,
      body: 'Status OK',
    };

    statusHandlerStub.resolves(expectedResponse);

    const response = await handler(event, context, callback, dependencies);

    expect(response).to.deep.equal(expectedResponse);
    expect(statusHandlerStub.calledOnce).to.be.true;
  });

  it('should return redirects handler response for /v1/redirects/cv path', async () => {
    const event = {
      rawPath: '/v1/redirects/cv',
    };
    const expectedResponse = {
      statusCode: 303,
      body: 'Redirecting',
    };

    redirectsHandlerStub.resolves(expectedResponse);

    const response = await handler(event, context, callback, dependencies);

    expect(response).to.deep.equal(expectedResponse);
    expect(redirectsHandlerStub.calledOnce).to.be.true;
  });

  it('should return downloads handler response for /v1/downloads/cv/{id} path', async () => {
    const event = {
      rawPath: '/v1/downloads/cv/123',
    };
    const expectedResponse = {
      statusCode: 303,
      body: 'Redirecting to download URL',
    };

    downloadsHandlerStub.resolves(expectedResponse);

    const response = await handler(event, context, callback, dependencies);

    expect(response).to.deep.equal(expectedResponse);
    expect(downloadsHandlerStub.calledOnce).to.be.true;
  });

  it('should forward the request to the origin if no matching path and return "Return Response" if available', async () => {
    const event = {
      rawPath: '/v1/unknown',
    };
    const expectedReturnResponse = {
      statusCode: 404,
      body: 'Not Found',
    };
    const expectedOriginResponse = null;

    forwardToOriginStub.resolves([
      expectedReturnResponse,
      expectedOriginResponse,
    ]);

    const response = await handler(event, context, callback, dependencies);

    expect(response).to.deep.equal(expectedReturnResponse);
    expect(forwardToOriginStub.calledOnce).to.be.true;
  });

  it('should forward the request to the origin if no matching path and return "Origin Response" if "Return Response" not available', async () => {
    const event = {
      rawPath: '/v1/unknown',
    };
    const expectedReturnResponse = null;
    const expectedOriginResponse = {
      statusCode: 200,
      body: 'Origin Response',
    };

    forwardToOriginStub.resolves([
      expectedReturnResponse,
      expectedOriginResponse,
    ]);

    const response = await handler(event, context, callback, dependencies);

    expect(response).to.deep.equal(expectedOriginResponse);
    expect(forwardToOriginStub.calledOnce).to.be.true;
  });

  it('should handle errors and return generic error response', async () => {
    const event = {
      rawPath: '/v1/unknown',
    };
    const error = new Error('Something went wrong');

    forwardToOriginStub.rejects(error);

    const response = await handler(event, context, callback, dependencies);

    expect(response).to.deep.equal({
      statusCode: '500',
      statusDescription: 'Unexpected Error',
      body: JSON.stringify({ error: 'An unexpected error was encountered.' }),
    });
    expect(logErrorStub.calledOnceWith('/', error)).to.be.true;
  });
});
