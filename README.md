# discord-bot-legend

Simple Discord bot for The Legend Gamming Community. Can play music from Youtube link in _Pukan_ voice channel and play short audio jokes if player _Jager_ online and joined to voice channel.

## Setup and run

1. Clone repo.
2. Run `npm install` in project folder.
3. Create `config.json` file in project folder:

```json
{
  "token": "DISCORD_BOT_TOKEN",
  "pukanAudio": "https://www.youtube.com/watch?v=n7gVzTULDPo",
  "pukanChannelID": "PUKAN_CHANNEL_ID",
  "afkChannelID": "AFK_CHANNEL_ID",
  "adminID": "GUILD_ADMIN_ID_FOR_ERROR_REPORTS",
  "guildID": "GUILD_ID",
  "jagerID": "JAGER_ID_FOR_JOKES",
  "jagerJokes": [
    "audio/rembo.ogg",
    "audio/ne_bombi.ogg",
    "audio/bolshe_karet.ogg",
    "audio/good_idea.ogg",
    "audio/keep_calm.ogg",
    "audio/kraken.ogg",
    "audio/loot.ogg",
    "audio/perenosit_bazu.ogg",
    "audio/popopo.ogg",
    "audio/zarazhenka.ogg"
  ],
  "jagerJokesInterval": 10
}
```

4. Run bot by command `node .` in project folder.
