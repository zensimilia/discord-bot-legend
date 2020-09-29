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

      if (isJagerAvailable) {
        let jagerInChannel = guild.voiceStates.cache.get(config.jagerID)
          .channel;
        let jokeURL =
          config.jagerJokes[(Math.random() * config.jagerJokes.length) | 0];

        jagerInChannel
          .join()
          .then((connection) => {
            const dispatcher = connection.play(fs.createReadStream(jokeURL), {
              type: "ogg/opus",
              volume: 0.75,
            });
            dispatcher.on("finish", () => connection.disconnect());
          })
          .catch((error) => {
            sendAdminMessage("Jager joke exception! " + error);
            jagerInChannel.leave();
          });
      }
    }, (1000 * 60 * config.jagerJokesInterval) | 20);
  }
});

client.on("message", (message) => {
  if (message.author.bot) return;

  sendAdminMessage(
    message.author.username + " wrote to me: >>> " + message.content
  );
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
      pukanChannel
        .join()
        .then((connection) => {
          const stream = ytdl(config.pukanAudio, {
            filter: "audioonly",
          });
          connection.play(stream).on("finish", () => connection.disconnect());
        })
        .catch((error) => {
          sendAdminMessage("Pukan channel exception! " + error);
          pukanChannel.leave();
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
  sendAdminMessage("Uncaught Promise Rejection! " + error);
});

client.login(config.token);
