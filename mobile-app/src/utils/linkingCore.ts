type OpenStatus = 'opened' | 'fallback-opened' | 'failed';

type OpenExternalUrlOptions = {
  opener: (url: string) => Promise<unknown>;
  fallbackUrl: string;
  onError?: (error: unknown, url: string) => void;
};

type LinkingLike = {
  openURL: (url: string) => Promise<unknown>;
};

export function createLinkingUrlOpener(linking: LinkingLike) {
  return (url: string) => linking.openURL(url);
}

export async function openExternalUrlSafely(
  url: string,
  { opener, fallbackUrl, onError = defaultOnError }: OpenExternalUrlOptions,
): Promise<OpenStatus> {
  const targetUrl = url.trim() || fallbackUrl;

  try {
    await opener(targetUrl);
    return 'opened';
  } catch (error) {
    onError(error, targetUrl);
  }

  if (targetUrl === fallbackUrl) {
    return 'failed';
  }

  try {
    await opener(fallbackUrl);
    return 'fallback-opened';
  } catch (error) {
    onError(error, fallbackUrl);
    return 'failed';
  }
}

function defaultOnError(error: unknown, url: string) {
  console.warn(`Unable to open external URL: ${url}`, error);
}
