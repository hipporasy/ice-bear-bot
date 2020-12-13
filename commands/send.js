module.exports = {
    name: 'send',
    description: 'Send a message',
    async execute(message, client) {
        if (message.author.id !== client.user.id) return;
        const split = message.content.split('|');
        const serverId = split.shift()
        const messageArgs = split.split(" ")
        const userId = messageArgs.shift()

        try {
            const guild = await client.guilds.fetch(serverId);
            const member = await guild.members.fetch(userId);
            member.send(messageArgs.join(" "))
        } catch (ex) {
            message.reply(ex)
        }
    },
};