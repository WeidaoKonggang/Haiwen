import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getAutoPlayStartBriefing, getNextBriefingInQueue } from './briefingPlayback';

describe('briefing playback queue', () => {
  const briefings = [{ id: 'first' }, { id: 'second' }, { id: 'third' }];

  it('starts autoplay from the first visible briefing', () => {
    assert.deepEqual(getNextBriefingInQueue(briefings, null), briefings[0]);
  });

  it('resumes autoplay from the paused briefing when it is still visible', () => {
    assert.deepEqual(getAutoPlayStartBriefing(briefings, 'second'), briefings[1]);
  });

  it('starts from the first visible briefing when there is no paused briefing', () => {
    assert.deepEqual(getAutoPlayStartBriefing(briefings, null), briefings[0]);
  });

  it('falls back to the first visible briefing when the paused briefing is filtered out', () => {
    assert.deepEqual(getAutoPlayStartBriefing(briefings, 'missing'), briefings[0]);
  });

  it('advances to the next visible briefing after the current one finishes', () => {
    assert.deepEqual(getNextBriefingInQueue(briefings, 'first'), briefings[1]);
  });

  it('returns null after the final briefing finishes', () => {
    assert.equal(getNextBriefingInQueue(briefings, 'third'), null);
  });

  it('returns null when the current briefing is no longer in the visible queue', () => {
    assert.equal(getNextBriefingInQueue(briefings, 'missing'), null);
  });
});
