module.exports = {
    name: 'send',
    description: 'Send a message',
    async execute(message, client) {
        console.log(message.author.id, console.log(process.env.OWNER_ID))
        console.log(message.author.id != process.env.OWNER_ID)
        if (message.author.id != process.env.OWNER_ID) return;
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