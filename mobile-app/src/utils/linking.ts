import { Linking } from 'react-native';

import { WEBSITE_URL } from '../data/website';
import { createLinkingUrlOpener, openExternalUrlSafely } from './linkingCore';

const openUrl = createLinkingUrlOpener(Linking);

export function openWebsite(url = WEBSITE_URL) {
  const targetUrl = url.trim() || WEBSITE_URL;

  void openExternalUrlSafely(targetUrl, {
    opener: openUrl,
    fallbackUrl: targetUrl,
  });
}
