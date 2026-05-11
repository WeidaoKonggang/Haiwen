import * as FileSystem from 'expo-file-system/legacy';

export async function writeSpeechAudioToCache(base64Audio: string, id = Date.now().toString()) {
  const cacheRoot = FileSystem.cacheDirectory || FileSystem.documentDirectory;

  if (!cacheRoot) {
    throw new Error('AUDIO_CACHE_DIRECTORY_UNAVAILABLE');
  }

  const uri = `${cacheRoot}haiwen-tts-${sanitizeFileId(id)}.mp3`;

  await FileSystem.writeAsStringAsync(uri, base64Audio, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return uri;
}

function sanitizeFileId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 80);
}
