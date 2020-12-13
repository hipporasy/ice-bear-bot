

module.exports = {
    name: "remove",
    aliases: ["rm"],
    description: "Remove song from the queue",
    execute(message, args) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send("There is no queue.").catch(console.error);

        if (!args.length) return message.reply(`Usage: ${message.client.prefix}remove <Queue Number>`);
        if (isNaN(args[0]) || args[0] === 'last') return message.reply(`Usage: ${message.client.prefix}remove <Queue Number>`);
        const song = null
        if (args[0] === 'last') {
            song = queue.songs.splice(args[0] - 1, 1);
        } else {
            song = queue.songs.splice(queue.songs.length - 1, 1);
        }

        queue.textChannel.send(`${message.author} ❌ removed **${song[0].title}** from the queue.`);
    }
};