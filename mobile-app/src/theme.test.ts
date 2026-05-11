import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { layout, radius, sizing, typography } from './theme';

describe('mobile design tokens', () => {
  it('uses compact iPhone 14 Pro friendly layout tokens', () => {
    assert.equal(layout.screenPaddingHorizontal, 20);
    assert.equal(layout.headerTopPadding, 18);
    assert.equal(sizing.tabIcon, 21);
    assert.equal(sizing.buttonHeight, 42);
  });

  it('keeps card and type scale restrained', () => {
    assert.equal(radius.card, 20);
    assert.equal(typography.pageTitle.fontSize, 32);
    assert.equal(typography.cardTitle.fontSize, 21);
    assert.equal(typography.button.fontSize, 14);
  });
});
