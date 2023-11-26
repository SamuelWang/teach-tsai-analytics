import {
  ConversationsHistoryResponse,
  ConversationsListResponse,
  ConversationsRepliesResponse,
} from '@slack/web-api';
import { get as getClient } from './client';

export async function history(
  start: number,
  end: number,
): Promise<ConversationsHistoryResponse> {
  const client = getClient();
  const channelId = process.env.CHANNEL_ID ?? '';

  try {
    const result = await client.conversations.history({
      channel: channelId,
      oldest: String(start / 1000),
      latest: String(end / 1000),
    });

    return result;
  } catch (error) {
    console.error(error);
    return Promise.resolve({
      ok: false,
      messages: [],
    });
  }
}

export async function list(types?: string): Promise<ConversationsListResponse> {
  const client = getClient();

  try {
    const result = await client.conversations.list({
      types,
    });

    return result;
  } catch (error) {
    console.error(error);
    return Promise.resolve({
      ok: false,
      channels: [],
    });
  }
}

export async function replies(
  ts: number,
): Promise<ConversationsRepliesResponse> {
  const client = getClient();
  const channelId = process.env.CHANNEL_ID ?? '';

  try {
    const result = await client.conversations.replies({
      channel: channelId,
      ts: String(ts),
    });

    return result;
  } catch (error) {
    console.error(error);
    return Promise.resolve({
      ok: false,
      messages: [],
    });
  }
}
