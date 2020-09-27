const config = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");
const fs = require("fs");

client.once("ready", () => {
  const guild = client.guilds.cache.get(config.guildID);

  console.log(`Logged in as ${client.user.tag}!`);

  // Text to speech https://cloud.yandex.ru/services/speechkit#demo
  if (config.jagerJokes) {
    const jagerJokesInterval = setInterval(() => {
      let isJagerAvailable = guild.voiceStates.cache.some(
        (user) =>
          user.id === config.jagerID &&
          user.channelID !== null &&
          user.channelID !== config.afkChannelID
      );
      if (isJagerAvailable) {
        let jagerInChannel = guild.voiceStates.cache.get(config.adminID)
          .channel;
        let jokeURL =
          config.jagerJokes[(Math.random() * config.jagerJokes.length) | 0];

        jagerInChannel.join().then((connection) => {
          const dispatcher = connection.play(fs.createReadStream(jokeURL), {
            type: "ogg/opus",
          });
          dispatcher.on("finish", () => connection.disconnect());
        });
      }
    }, 1000 * 60 * config.jagerJokesInterval);
  }
});

client.on("message", (message) => {
  console.log(message.content);
});

client.on("voiceStateUpdate", (oldState, newState) => {
  let newVoiceChannelID = newState.channelID;
  let oldVoiceChannelID = oldState.channelID;
  let pukanChannel = client.channels.cache.get(config.pukanChannelID);
  let clientInPukanChannel = client.voice.connections.some(
    (conn) => conn.channel.id === config.pukanChannelID
  );

  if (newVoiceChannelID === config.pukanChannelID) {
    if (!clientInPukanChannel) {
      pukanChannel.join().then((connection) => {
        const stream = ytdl(config.pukanAudio, {
          filter: "audioonly",
        });
        const dispatcher = connection.play(stream);
        dispatcher.on("finish", () => connection.disconnect());
      });
    }
  }

  if (oldVoiceChannelID === config.pukanChannelID) {
    if (pukanChannel.members.size === 1 && clientInPukanChannel) {
      pukanChannel.leave();
    }
  }
});

process.on("unhandledRejection", (error) => {
  client.users.cache
    .get(config.adminID)
    .send("Uncaught Promise Rejection! " + error);
});

client.login(config.token);
