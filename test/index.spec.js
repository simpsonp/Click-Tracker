import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from 'cloudflare:test';
import { describe, it, expect, beforeEach } from 'vitest';
import worker from '../src';

describe('Worker', () => {
  let request;
  let ctx;

  describe('with valid request', () => {
    beforeEach(() => {
      const url =
        'https://api.simpsonpaul.com/v1/redirects/cv?v=202208-1&from=linkedin&to=github';
      // TODO: Remove the above sample demo values before deploying to production.
      // NOTE/TODO: REDACTED. Remove the below production list before pushing code to public repository.

      request = new Request(url);
      // Create an empty context to pass to `worker.fetch()`.
      ctx = createExecutionContext();
    });

    it('responds with 303 status', async () => {
      const response = await worker.fetch(request, env, ctx);
      // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(303);
    });
  });

  describe('with invalid request', () => {
    beforeEach(() => {
      request = new Request(
        'https://api.simpsonpaul.com/v1/redirects/cv?v=1&from=a&to=a'
      );
      // Create an empty context to pass to `worker.fetch()`.
      ctx = createExecutionContext();
    });

    it('responds with 400 status', async () => {
      const response = await worker.fetch(request, env, ctx);
      // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(400);
    });
  });
});
