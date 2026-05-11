export function getAutoPlayStartBriefing<T extends { id: string }>(briefings: T[], pausedId: string | null) {
  if (briefings.length === 0) {
    return null;
  }

  if (pausedId) {
    const pausedBriefing = briefings.find((briefing) => briefing.id === pausedId);

    if (pausedBriefing) {
      return pausedBriefing;
    }
  }

  return briefings[0];
}

export function getNextBriefingInQueue<T extends { id: string }>(briefings: T[], currentId: string | null) {
  if (briefings.length === 0) {
    return null;
  }

  if (!currentId) {
    return briefings[0];
  }

  const currentIndex = briefings.findIndex((briefing) => briefing.id === currentId);

  if (currentIndex < 0 || currentIndex >= briefings.length - 1) {
    return null;
  }

  return briefings[currentIndex + 1];
}
