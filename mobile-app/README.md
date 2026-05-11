# Haiwen Companion

Lightweight mobile and tablet companion app for the ENT208TC Session 2 Group 13 Haiwen / HQ project.

Haiwen Companion is designed for busy Chinese AI enterprise managers who need quick ESG and globalization updates, short consultation answers, and saved items that can be opened later on the full HQ website. The current UI is optimized for short commute sessions: open the app, scan the brief, ask one question, save what matters.

## Run Locally

```bash
cd mobile-app
npm install
npx expo start
```

Open the app in Expo Go or an Android/iOS simulator. The app is native-first, with tablet support enabled in Expo config.

For phone testing outside the same local network, use the tunnel command:

```bash
npx expo start --tunnel --clear
```

## DeepSeek Quick Ask Setup

Quick Ask can call DeepSeek for real AI answers. Fill in `.env` before starting Expo:

```env
EXPO_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_api_key
EXPO_PUBLIC_DEEPSEEK_API_URL=https://api.deepseek.com/chat/completions
EXPO_PUBLIC_DEEPSEEK_MODEL=deepseek-chat
```

`.env` is ignored by git. `.env.example` is safe to commit and documents the required values.

If the API key is not filled, or if the request fails during a demo, Quick Ask automatically falls back to local mock responses.

## Xfyun Briefing Voice Setup

Today's Brief can use Xfyun super-human text-to-speech for a more natural voice. Fill in these values in `.env`:

```env
EXPO_PUBLIC_XFYUN_TTS_APP_ID=your_xfyun_app_id
EXPO_PUBLIC_XFYUN_TTS_API_KEY=your_xfyun_api_key
EXPO_PUBLIC_XFYUN_TTS_API_SECRET=your_xfyun_api_secret
EXPO_PUBLIC_XFYUN_TTS_URL=wss://cbm01.cn-huabei-1.xf-yun.com/v1/private/mcd9m97e6
EXPO_PUBLIC_XFYUN_TTS_VOICE=x5_lingxiaoxuan_flow
EXPO_PUBLIC_XFYUN_TTS_SPEED=45
EXPO_PUBLIC_XFYUN_TTS_VOLUME=70
EXPO_PUBLIC_XFYUN_TTS_PITCH=50
```

Use the WebSocket API address and voice ID from your Xfyun console. If these values are not filled, or if Xfyun fails during a demo, the app automatically falls back to the built-in Expo system speech.

For a production app, move `APISecret` to the HQ website backend instead of exposing it in the mobile bundle. Keeping it in `.env` is acceptable for a local class demo only.

## Juhe Daily News Setup

Today's Brief can pull real daily news from Juhe's News Headlines API and convert relevant ESG, AI governance, data compliance, and globalization signals into Haiwen briefing cards.

Fill in `.env`:

```env
EXPO_PUBLIC_JUHE_NEWS_KEY=your_juhe_news_key
EXPO_PUBLIC_JUHE_NEWS_BASE_URL=https://v.juhe.cn/toutiao
EXPO_PUBLIC_JUHE_NEWS_TYPES=guoji,keji,caijing
EXPO_PUBLIC_JUHE_NEWS_PAGE_SIZE=10
EXPO_PUBLIC_JUHE_NEWS_PAGE_COUNT=2
```

The app requests `guoji`, `keji`, and `caijing` by default, loads multiple pages per category, and prefers Haiwen-relevant ESG/globalization signals. Today's Brief targets 8 distinct live-news cards with original article URLs. If fewer than 8 relevant items are available, the app fills the remaining slots from other distinct Juhe articles that still have original links, instead of duplicating generic cards. To keep commute loading fast, DeepSeek summarizes the first few live items and the remaining live items use a fast local fallback title/summary. If Juhe fails completely, it falls back to local mock briefings so the demo still has content.

## Supabase Account Sync Setup

The app can share the same Supabase email/password account system as the HQ website. Add only the public values to `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

Do not put a Supabase `service_role` key in the Expo app. That key belongs only on a trusted backend.

After editing `.env`, restart Expo so the public variables are bundled:

```bash
npx expo start --clear
```

The app shows an account gate before the main tabs. Users must sign in or create an account with the same Supabase email/password system used by the website before entering Haiwen Companion, then can sign out from the Saved tab. If Supabase email confirmation is enabled, newly registered users must confirm their email before signing in. Saved items are stored locally first, and can be sent to the HQ website inbox when a website sync code is linked.

## HQ Website Inbox Sync

The HQ website inbox at `https://hq-haiwhen.vercel.app/zh/inbox` can generate a 6-character sync code. Enter that code in the Saved tab under **Website inbox sync**. After a code is saved, Brief and Quick Ask save actions still save locally and also try to send the item to:

```text
https://hq-haiwhen.vercel.app/api/inbox/save
```

When you first enter a sync code, the app also attempts to backfill items that were already saved locally before the code was linked. This prevents the common demo issue where an item is saved first, the code is entered later, and the website never receives the older local item. Use the Saved tab's website button to open `https://hq-haiwhen.vercel.app/zh/inbox?code=YOURCODE` directly if the website page is showing an older local sync code.

If the website sync fails, the local app save still works. Clear the sync code from the Saved tab to stop sending future saved items to the website inbox.

## Useful Commands

```bash
npm test
npm run typecheck
npm run android
npm run ios
npm run web
```

## MVP Features

- Three-tab bottom navigation: Brief, Ask, and Saved.
- Restrained blue-gray visual system tuned for iPhone 14 Pro safe areas and quick commute use.
- English / Chinese language switch across the main UI, briefing copy, tags, and mock answers.
- Supabase email/password login and registration using the same account system as the HQ website.
- Quick Ask screen with text input, microphone UI state, sample questions, local AI-style mock responses, and save action.
- Today's Brief screen with 8 distinct Juhe-first daily briefing cards, DeepSeek-assisted brief summaries, region chips, one-tap autoplay, Xfyun text-to-speech listening with Expo system speech fallback, save action, and original-news website handoff.
- Saved Items screen with locally persisted briefing cards and consultation results, plus optional HQ website inbox sync by 6-character sync code.
- Briefing records now include stable per-item website URLs and are loaded through an API-ready data function.

## Mocked in This MVP

- AI consultation responses call DeepSeek when `.env` is configured, with local mock fallback in `src/data/mockAi.ts`.
- Briefing cards use Juhe real news when `.env` is configured, with local bilingual mock data fallback in `src/data/briefings.ts`.
- Microphone input only changes UI state; it does not record or transcribe audio.
- Briefing listening calls Xfyun when configured, then plays generated MP3 audio locally. Without Xfyun config, it uses on-device `expo-speech`.
- Juhe news is filtered locally for relevance; DeepSeek improves summaries when available. A production app should proxy Juhe and DeepSeek through the HQ website backend instead of exposing API keys in the app bundle.
- Supabase account login/registration is implemented; website-side saved display currently works through the HQ inbox sync-code API, while full account-based saved-item sync would still need a shared table or authenticated website API.

All website handoff buttons open:

```text
https://hq-haiwhen.vercel.app
```

## Project Structure

```text
app/(tabs)/             Expo Router tab screens
src/components/         Shared UI components
src/data/               Mock briefing, alert, AI, and website data
src/state/              Saved items context, persistence, and pure helpers
src/types.ts            Shared TypeScript types
src/utils/              Website linking helpers
```

## Next Steps

- Add real speech-to-text for Quick Ask.
- Connect Quick Ask to a real LLM API or HQ backend endpoint.
- Move Juhe, DeepSeek, and Xfyun calls behind the HQ website backend for safer production deployment.
- Add real push notifications for selected watchlist regions and topics.
- Add a shared Supabase saved-items table or authenticated website API for full account-based saved-item sync.
