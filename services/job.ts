import { CronJob } from 'cron';
import * as DataAccess from '../data-access';
import { analyzeReplies } from './analysis';
import { generateContentFromMealGroups, getReplies } from './message';

export function startAnalysisJob() {
  new CronJob(
    '00 20 2 * * 1-5',
    async () => {
      const replies = await getReplies();
      const groups = analyzeReplies(replies);
      const content = generateContentFromMealGroups(groups);
      const channelId = process.env.COUNTER_CHANNEL_ID ?? '';
      await DataAccess.Slack.Chat.postMessage(channelId, content);
    },
    null,
    true,
    process.env.TimeZone,
  );
}
