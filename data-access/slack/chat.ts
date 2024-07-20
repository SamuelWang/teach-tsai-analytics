import { ChatPostMessageResponse } from '@slack/web-api';
import { get as getClient } from './client';

export async function postMessage(
  channelId: string,
  content: string[],
): Promise<ChatPostMessageResponse> {
  const client = getClient();

  try {
    const result = await client.chat.postMessage({
      channel: channelId,
      blocks: content.map((text) => ({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text,
        },
      })),
    });

    return result;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      channel: channelId,
    };
  }
}
