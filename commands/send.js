module.exports = {
    name: 'send',
    description: 'Send a message',
    async execute(message, client) {
        if (message.author.id != process.env.OWNER_ID) return;
        const messageSplit = message.content.slice(6).split('|');
        const serverId = messageSplit.shift()
        const messageArgs = messageSplit[0].split(" ")
        const userId = messageArgs.shift()
        const msg = messageArgs.join(" ")
        client.guilds.fetch(serverId).then((guild) => {
            guild.members.fetch(userId).then((user) => {
                user.send(msg)
                message.reply(`Message sent to ${user.displayName}`)
            }).catch(console.error)
        }).catch(console.error)

    },
};