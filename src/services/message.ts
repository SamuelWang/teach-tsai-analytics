import { MessageElement } from '@slack/web-api/dist/response/ConversationsHistoryResponse';
import * as DataAccess from '../data-access';
import { Reply } from '../models/message';
import { getTodayUtcTimestamp } from './criteria';
import { Member } from '@slack/web-api/dist/response/UsersListResponse';

export async function getReplies(): Promise<Reply[]> {
  const historyResult = await DataAccess.Slack.Conversations.history(
    getTodayUtcTimestamp(1),
    getTodayUtcTimestamp(3),
  );

  if (!historyResult.ok || !historyResult.messages) {
    return Promise.reject();
  }

  const historyMessages = historyResult.messages.filter(
    (m) => m.type === 'message' && m.subtype !== 'channel_join',
  );
  const orderMessage = historyMessages.find(
    (m) => m.text?.includes('今日有訂餐'),
  );

  if (!orderMessage || !orderMessage.ts) {
    return Promise.resolve([]);
  }

  const repliesResult = await DataAccess.Slack.Conversations.replies(
    orderMessage.ts,
  );
  const usersResult = await DataAccess.Slack.Users.list();

  if (
    !repliesResult.ok ||
    !repliesResult.messages ||
    !usersResult.ok ||
    !usersResult.members
  ) {
    return Promise.reject();
  }

  return Promise.resolve([
    ...mapMessagesToReplies(
      filterOutValidMessages(repliesResult.messages),
      usersResult.members,
    ),
    ...mapMessagesToReplies(
      filterOutValidMessages(historyMessages),
      usersResult.members,
    ),
  ]);
}

function filterOutValidMessages(messages: MessageElement[]) {
  return messages.filter((m) => !m.text?.includes('今日有訂餐'));
}

function mapMessagesToReplies(
  messages: MessageElement[],
  users: Member[],
): Reply[] {
  const replies: Reply[] = [];

  messages.forEach((message) => {
    replies.push({
      userRealName:
        users.find((member) => member.id === message.user)?.real_name ?? '',
      message: message.text ?? '',
    });
  });

  return replies;
}
