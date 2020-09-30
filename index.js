const config = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");
const fs = require("fs");

/**
 * Send PM to user specified in config.json as adminID
 * @param {string} message
 */
const sendAdminMessage = function (message) {
  client.users.cache.get(config.adminID).send(message);
};

client.once("ready", () => {
  const guild = client.guilds.cache.first();

  console.log(`Logged in as ${client.user.tag}!`);

  // Text to speech https://cloud.yandex.ru/services/speechkit#demo
  if (config.jagerID && config.jagerJokes) {
    const jagerJokesInterval = setInterval(() => {
      let isJagerAvailable = guild.voiceStates.cache.some(
        (user) =>
          user.id === config.jagerID &&
          user.channelID !== null &&
          user.channelID !== guild.afkChannelID &&
          user.channelID !== config.pukanChannelID
      );
      let clientInPukan = client.voice.connections.get(config.pukanChannelID);

      if (isJagerAvailable && !clientInPukan) {
        let jagerInChannel = guild.voiceStates.cache.get(config.jagerID)
          .channel;
        let jokeURL =
          config.jagerJokes[(Math.random() * config.jagerJokes.length) | 0];

        jagerInChannel
          .join()
          .then((connection) => {
            const stream = fs.createReadStream(jokeURL);
            const dispatcher = connection.play(stream, {
              type: "ogg/opus",
            });
            stream.on("error", (error) => {
              sendAdminMessage(`Jager joke stream exception! ${error}`);
              jagerInChannel.leave();
            });
            dispatcher.on("finish", () => connection.disconnect());
          })
          .catch((error) => {
            sendAdminMessage(`Jager joke exception! ${error}`);
            jagerInChannel.leave();
          });
      }
    }, (1000 * 60 * config.jagerJokesInterval) | 20);
  }
});

client.on("message", (message) => {
  if (message.author.bot || message.guild) return;

  sendAdminMessage(
    `${message.author.username} wrote to me: ${message.content}`
  );
});

client.on("voiceStateUpdate", (oldState, newState) => {
  if (newState.id === client.user.id) return; // ignore bot

  let newVoiceChannelID = newState.channelID;
  let pukanChannel = client.channels.cache.get(config.pukanChannelID);
  let clientInPukanChannel = client.voice.connections.some(
    (conn) => conn.channel.id === config.pukanChannelID
  );

  if (newVoiceChannelID === config.pukanChannelID) {
    if (!clientInPukanChannel) {
      pukanChannel
        .join()
        .then((connection) => {
          const stream = ytdl(config.pukanAudio, {
            filter: "audioonly",
          });
          const dispatcher = connection.play(stream);
          dispatcher.on("finish", () => connection.disconnect());
        })
        .catch((error) => {
          sendAdminMessage(`Pukan channel exception! ${error}`);
          pukanChannel.leave();
        });
    }
  }

  // Bot leaves Pukan channel if nobody listen him
  if (pukanChannel.members.size === 1 && clientInPukanChannel) {
    pukanChannel.leave();
  }
});

process.on("unhandledRejection", (error) => {
  sendAdminMessage(`Uncaught Promise Rejection! ${error}`);
});

client.login(config.token);
