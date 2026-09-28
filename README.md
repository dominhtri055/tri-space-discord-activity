# Tri Space — Discord Activity

A personal, polished Discord Activity built with React + TypeScript + Vite + Discord Embedded App SDK.

## Features

- Personal profile card with editable name, handle, bio, and mood
- Glass / animated ambient UI
- Accent hue control
- Local music player
  - drag & drop MP3 / WAV / OGG / M4A
  - play / pause / previous / next
  - seek
  - volume
  - multi-track playlist
  - animated visualizer
- Clock / date card
- Portfolio and GitHub links
- Discord Embedded App SDK bootstrap
- Browser-preview fallback so you can design it before launching it inside Discord

> Audio files are not bundled. Add your own local audio at runtime. This avoids shipping copyrighted tracks and keeps your audio local to your session.

## 1. Install

```powershell
npm install
Copy-Item .env.example .env
```

## 2. Create a Discord application

Open the Discord Developer Portal:

https://discord.com/developers/applications

Create an application, e.g. `Tri Space`.

Copy the **Application ID**.

Edit `.env`:

```env
VITE_DISCORD_CLIENT_ID=YOUR_APPLICATION_ID
```

## 3. Run locally

```powershell
npm run dev
```

Open the local URL Vite prints.

The app works in **Browser preview** mode outside Discord.

## 4. Build

```powershell
npm run build
```

Production files will be in `dist/`.

## 5. Deploy over HTTPS

Deploy the project to Vercel, Cloudflare Pages, Netlify, or another HTTPS host.

Example with Vercel:

```powershell
npm i -g vercel
vercel
```

When you have the public HTTPS URL, configure that URL in the Discord Developer Portal.

## 6. Configure the Discord Activity

In your Discord application:

1. Go to **Activities → Settings**.
2. Add a **URL Mapping** pointing to your deployed HTTPS app.
3. Enable **Activities**.
4. Keep the app unverified while developing/testing.
5. Launch the Activity from Discord with your developer account/team.

Discord requires a URL Mapping before Activities can be enabled.

## Music

Click **+ Add music** or drag local audio files onto the music card.

For cleaner track names, name files like:

```text
Artist - Song Name.mp3
```

Tri Space will parse the filename as artist + song.

## Important architecture note

This is an **interactive Discord Activity**, not an arbitrary Profile Board widget. Discord Activities run in an embedded iframe inside Discord and are the correct platform surface for custom interactive UI such as music/listen experiences.

## Next upgrades

Good v2 upgrades would be:

- Discord OAuth identity/avatar
- synchronized listen party
- Spotify metadata integration
- persistent playlists with IndexedDB
- real spectrum analyser using Web Audio API
- shared rooms via WebSocket/Supabase
- custom background image upload
- animated themes and presets
