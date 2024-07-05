# teacher-tsai-analytics

A app for the order couting of the teacher-tsai channel.

## Set up the environments

1. copy the `.env.template` to `.env`
2. replace the env var `SLACK_BOT_USER_OAUTH_TOKEN` to your token that can access `teacher-tsai` (read) and `teacher-tsai-counter` (write) channels
3. the env var `COUNTER_CHANNEL_ID` is the ID of the channel that this counter will post results to, replace it to the target channel ID
4. the env var `TEACHER_TSAI_CHANNEL_ID` is the ID of the teacher tsai channel

## Run App in development mode

Execute `npm run dev`
