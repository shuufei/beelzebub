import { deckDb } from './deck-db';

describe('deckDb', () => {
  it('should work', () => {
    expect(deckDb()).toEqual('deck-db');
  });
});
