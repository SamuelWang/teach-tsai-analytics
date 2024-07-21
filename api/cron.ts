import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as DataAccess from '../data-access';
import { analyseReplies } from '../services/analysis';
import { generateContentFromMealGroups, getReplies } from '../services/message';

export default async function handler(
  _request: VercelRequest,
  response: VercelResponse,
) {
  const replies = await getReplies();
  const groups = analyseReplies(replies);
  const content = generateContentFromMealGroups(groups);
  const channelId = process.env.COUNTER_CHANNEL_ID ?? '';
  const postResult = await DataAccess.Slack.Chat.postMessage(
    channelId,
    content,
  );

  if (postResult.ok) {
    return response.status(200);
  } else {
    return response.status(500);
  }
}
