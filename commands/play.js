const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");

const youtube = new YouTubeAPI(process.env.YouTubeAPI);

module.exports = {
  name: "play",
  aliases: ["p", "q", "queue"],
  description: "Play a song in your channel!",
  async execute(message) {
    try {

      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);

      const voiceChannel = message.member.voice.channel;

      if (!voiceChannel)
        return message.channel.send(
          "You need to be in a voice channel to play music!"
        );
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
          "I need the permissions to join and speak in your voice channel!"
        );
      }
      const args = message;
      const search = args.join(" ");
      const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
      const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
      const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
      const url = args[0];
      const urlValid = videoPattern.test(args[0]);

      if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
        return message.client.commands.get("playlist").execute(message, args);
      }

      if (mobileScRegex.test(url)) {
        try {
          https.get(url, function (res) {
            if (res.statusCode == "302") {
              return message.client.commands.get("play").execute(message, [res.headers.location]);
            } else {
              return message.reply("No content could be found at that url.").catch(console.error);
            }
          });
        } catch (error) {
          console.error(error);
          return message.reply(error.message).catch(console.error);
        }
        return message.reply("Following url redirection...").catch(console.error);
      }

      let songInfo = null;
      let song = null;

      if (urlValid) {
        try {
          songInfo = await ytdl.getInfo(url);
          song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            duration: songInfo.videoDetails.lengthSeconds
          };
        } catch (error) {
          console.error(error);
          return message.reply(error.message).catch(console.error);
        }
      } else {
        try {
          const results = await youtube.searchVideos(search, 1);
          songInfo = await ytdl.getInfo(results[0].url);
          song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            duration: songInfo.videoDetails.lengthSeconds
          };
        } catch (error) {
          console.error(error);
          return message.reply(error.message).catch(console.error);
        }
      }

      if (!serverQueue) {
        const queueContruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          loop: false,
          playing: true
        };
        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
          this.play(message, queueContruct.songs[0]);
        } catch (err) {
          console.log(err);
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
      } else {
        serverQueue.songs.push(song);
        return message.channel.send(
          `${song.title} has been added to the queue!`
        );
      }
    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
  },

  play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        if (queue.loop) {
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          this.play(queue.songs[0], message);
        } else {
          queue.songs.shift();
          this.play(queue.songs[0], message);
        }
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  }
};
