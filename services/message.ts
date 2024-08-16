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

  const now = new Date();
  const content: string[] = [
    `*今日（${now.getMonth() + 1}/${now.getDate()}）訂餐統計：*`,
    `總共 \`${mealGroups
      .filter((g) => g.mealNo !== -1)
      .reduce((prev, current) => prev + current.count, 0)}\` 個餐`,
  ];

  mealGroups.sort((a, b) => (b.mealNo === -1 ? -1 : a.mealNo - b.mealNo));

  const mealCountMessages: string[] = [];
  const replyMessages: string[] = [];
  const unknownMessages: string[] = [];

  mealGroups.forEach((g) => {
    if (g.mealNo === -1) {
      unknownMessages.push(
        ...g.replies.map((r) => `●  ${generateMessageFromReply(r)}`),
      );
      return;
    }

    mealCountMessages.push(`●  ${generateMessageFromMealGroup(g)}`);

    replyMessages.push(
      ...g.replies.map((r) => `●  ${generateMessageFromReply(r)}`),
    );
  });

  if (unknownMessages.length) {
    content.push('無法判斷的訊息：');
    content.push(unknownMessages.join('\n'));
  }

  content.push(mealCountMessages.join('\n'));
  content.push('回覆訊息：');
  content.push(replyMessages.join('\n'));

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
    message.push('（少飯）');
  }

  if (mealGroup.moreRice) {
    message.push('（加飯）');
  }

  if (mealGroup.specialRequirement) {
    message.push('（有特殊需求）');
  }

  message.push(` \`x ${mealGroup.replies.length}\``);

  return message.join('');
}

export function generateMessageFromReply(reply: Reply): string {
  return `${reply.userRealName}：${reply.message}`;
}

export async function getReplies(): Promise<Reply[]> {
  const historyResult = await DataAccess.Slack.Conversations.history(
    getTodayUtcTimestamp(1),
    getTodayUtcTimestamp(2, 20),
  );

  if (!historyResult.ok || !historyResult.messages) {
    return [];
  }

  const historyMessages = historyResult.messages.filter(
    (m) => m.type === 'message' && m.subtype !== 'channel_join',
  );
  const orderMessage = historyMessages.find(
    (m) => m.text?.includes('菜單樣式如下'),
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
  return messages.filter(
    (m) => !(m.text?.includes('今日有訂餐') || m.text?.includes('今天有訂餐')),
  );
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
