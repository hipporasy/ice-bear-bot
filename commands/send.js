module.exports = {
    name: 'send',
    description: 'Send a message',
    async execute(message, client) {
        console.log(message.author.id != client.user.id)
        if (message.author.id != client.user.id) return;
        console.log('asdfadsf')
        const split = message.content.split('|');
        const serverId = split.shift()
        const messageArgs = split.split(" ")
        const userId = messageArgs.shift()
        console.log(serverId)
        console.log(userId)
        try {
            const guild = await client.guilds.fetch(serverId);
            const member = await guild.members.fetch(userId);
            member.send(messageArgs.join(" "))
        } catch (ex) {
            message.reply(ex)
        }
    },
};