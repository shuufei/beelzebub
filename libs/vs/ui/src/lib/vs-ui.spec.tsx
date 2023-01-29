import { render } from '@testing-library/react';

import VsUi from './vs-ui';

describe('VsUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VsUi />);
    expect(baseElement).toBeTruthy();
  });
});
