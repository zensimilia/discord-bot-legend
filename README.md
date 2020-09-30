# discord-bot-legend

Simple Discord bot for _The Legend Gaming Community_. Can play music from Youtube link in _Pukan_ voice channel and play short audio jokes if player _Jager_ online and joined to voice channel.

## Setup and run

1. Clone repo and change working directory.
2. Run `npm install`.
3. Create and fill `config.json` file in project root directory.
4. Run bot by command `npm run start`.

## Configuration

Params in `config.json`:

- `"token"` (_required_, _string_) - Discord bot token.
- `"pukanAudio"` (_required_, _string_, _URL_) - link to youtube video with music you want to play in specific voice cahnnel (e.g. _Pukan_).
- `"pukanChannelID"` (_required_, _string_) - Discord ID of specific voice channel where music will play when any user connect to it.
- `"adminID"` (_required_, _string_) - Discord ID of guild admin user used for error reports.
- `"jagerID"` (_string_) - Discord user ID for which jokes will be played according to the interval (e.g. _Jager_).
- `"jagerJokes"` (_array of strings_) - list of paths to audio **OGG** files with jokes. Bot will get random from this list.
- `"jagerJokesInterval"` (_integer_) - interval in minites when the jokes will be played.

Full `config.json` example:

```json
{
  "token": "DISCORD_BOT_TOKEN",
  "pukanAudio": "LINK_TO_YOUTUBE_VIDEO",
  "pukanChannelID": "PUKAN_CHANNEL_ID",
  "adminID": "GUILD_ADMIN_ID_FOR_ERROR_REPORTS",
  "jagerID": "JAGER_ID_FOR_JOKES",
  "jagerJokes": ["audio/joke.ogg", "audio/another_joke.ogg"],
  "jagerJokesInterval": 20
}
```

## Requirements

- **Node.js** >= 14.2.0
- OS: Windows, Linux or Mac OS.
