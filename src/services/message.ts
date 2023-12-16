import { MessageElement } from '@slack/web-api/dist/response/ConversationsHistoryResponse';
import { Member } from '@slack/web-api/dist/response/UsersListResponse';
import * as DataAccess from '../data-access';
import { RiceType } from '../enums';
import { MealGroup, Reply } from '../models';
import { getTodayUtcTimestamp } from '../utils/criteria/timestamp.utils';

export function generateContentFromMealGroups(
  mealGroups: MealGroup[],
): string[] {
  if (!mealGroups.length) {
    return ['今日沒有任何訂餐'];
  }

  const content: string[] = ['*今日訂餐統計：*'];

  mealGroups.sort((a, b) => a.mealNo - b.mealNo);

  mealGroups.forEach((g) => {
    const messages: string[] = [];

    if (g.mealNo === -1) {
      messages.push('*未知*');
    } else {
      messages.push(`*${generateMessageFromMealGroup(g)}*`);
    }

    messages.push(
      ...g.replies.map((r) => `\t\t●  ${generateMessageFromReply(r)}`),
    );

    content.push(messages.join('\n'));
  });

  return content;
}

export function generateMessageFromMealGroup(mealGroup: MealGroup): string {
  const message: string[] = [];

  switch (mealGroup.mealNo) {
    case 1:
      message.push('１）五樣菜 S.小而美便當');
      break;
    case 2:
      message.push('２）七樣菜 C.每日特餐');
      break;
    case 3:
      message.push('３）風味餐（無配菜）');
      break;
    case 4:
      message.push('４）風味餐');
      break;
    case 5:
      message.push('５）三樣配菜');
      break;
  }

  switch (mealGroup.riceType) {
    case RiceType.PurpleRice:
      message.push('（紫米）');
      break;
    case RiceType.WhiteRice:
      message.push('（白飯）');
      break;
  }

  if (mealGroup.lessRice) {
    message.push('（飯少）');
  }

  if (mealGroup.specialRequirement) {
    message.push('（有特殊需求）');
  }

  message.push(` x ${mealGroup.replies.length}`);

  return message.join('');
}

export function generateMessageFromReply(reply: Reply): string {
  return `${reply.userRealName}：${reply.message}`;
}

export async function getReplies(): Promise<Reply[]> {
  const historyResult = await DataAccess.Slack.Conversations.history(
    getTodayUtcTimestamp(1),
    getTodayUtcTimestamp(3),
  );

  if (!historyResult.ok || !historyResult.messages) {
    return [];
  }

  const historyMessages = historyResult.messages.filter(
    (m) => m.type === 'message' && m.subtype !== 'channel_join',
  );
  const orderMessage = historyMessages.find(
    (m) => m.text?.includes('今日有訂餐'),
  );

  if (!orderMessage || !orderMessage.ts) {
    return [];
  }

  const channelId = process.env.TEACHER_TSAI_CHANNEL_ID ?? '';
  const repliesResult = await DataAccess.Slack.Conversations.replies(
    channelId,
    orderMessage.ts,
  );

  if (!repliesResult.ok || !repliesResult.messages) {
    return [];
  }

  const usersResult = await DataAccess.Slack.Users.list();

  if (!usersResult.ok || !usersResult.members) {
    return [];
  }

  return [
    ...mapMessagesToReplies(
      filterOutValidMessages(repliesResult.messages),
      usersResult.members,
    ),
    ...mapMessagesToReplies(
      filterOutValidMessages(historyMessages),
      usersResult.members,
    ),
  ];
}

export function filterOutValidMessages(messages: MessageElement[]) {
  return messages.filter((m) => !m.text?.includes('今日有訂餐'));
}

export function mapMessagesToReplies(
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
