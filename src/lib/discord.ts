import { DiscordSDK } from "@discord/embedded-app-sdk";

const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID as string | undefined;

export type DiscordState = {
  embedded: boolean;
  ready: boolean;
  error?: string;
};

export async function initDiscord(): Promise<DiscordState> {
  if (!clientId || clientId === "YOUR_DISCORD_APPLICATION_ID") {
    return {
      embedded: false,
      ready: false,
      error: "Set VITE_DISCORD_CLIENT_ID to enable Discord Activity mode."
    };
  }

  try {
    const sdk = new DiscordSDK(clientId);
    await sdk.ready();
    return { embedded: true, ready: true };
  } catch (error) {
    return {
      embedded: false,
      ready: false,
      error: error instanceof Error ? error.message : "Discord SDK unavailable."
    };
  }
}
