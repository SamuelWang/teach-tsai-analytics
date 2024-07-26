# teacher-tsai-analytics

A app for the order couting of the teacher-tsai channel.

## Set up the environment variables

1. copy the `.env.template` to `.env`
2. replace the env var `SLACK_BOT_USER_OAUTH_TOKEN` to your token that can access `teacher-tsai` (read) and `teacher-tsai-counter` (write) channels
3. set the env var `COUNTER_CHANNEL_ID` with the ID of the channel, this counter app will post results to the channel of the target channel ID
4. set the env var `TEACHER_TSAI_CHANNEL_ID` with the ID of the teacher tsai channel
5. set the env var `ACCESS_KEY` with any string as the access token

## Start the development server

1. `npm install`
2. `npm run dev`

## Start the cron job on the development server

1. POST http://{HOST}:{HOST}/counting?key={ACCESS_KEY}
2. If the above request responds 201 (Created), the cron jos is successfully created.
