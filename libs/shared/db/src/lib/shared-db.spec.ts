import { sharedDb } from './shared-db';

describe('sharedDb', () => {
  it('should work', () => {
    expect(sharedDb()).toEqual('shared-db');
  });
});
