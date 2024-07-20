import { WebClient, LogLevel } from '@slack/web-api';

export function get(): WebClient {
  const token = process.env.SLACK_BOT_USER_OAUTH_TOKEN;
  const client = new WebClient(token, {
    logLevel: LogLevel.DEBUG,
  });
  return client;
}
