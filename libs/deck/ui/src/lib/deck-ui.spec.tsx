import { render } from '@testing-library/react';

import DeckUi from './deck-ui';

describe('DeckUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeckUi />);
    expect(baseElement).toBeTruthy();
  });
});
