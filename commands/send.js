module.exports = {
    name: 'send',
    description: 'Send a message',
    async execute(message, client) {
        if (message.author.id != process.env.OWNER_ID) return;
        const messageSplit = message.content.split('|');
        const serverId = messageSplit.shift()
        console.log(messageSplit)
        const messageArgs = messageSplit[0].split(" ")
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