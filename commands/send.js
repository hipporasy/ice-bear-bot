module.exports = {
    name: 'send',
    description: 'Send a message',
    async execute(message, client) {
        if (message.author.id != process.env.OWNER_ID) return;
        const messageSplit = message.content.slice(0, 4).split('|');
        const serverId = messageSplit.shift()
        const messageArgs = messageSplit[0].split(" ")
        const userId = messageArgs.shift()
        const msg = messageArgs.join(" ")
        client.guilds.fetch(serverId).then((guild) => {
            guild.members.fetch(userId).then((user) => {
                user.send(" ort yul te bah")
                user.send(msg)
            }).catch(console.error)
        }).catch(console.error)
        // try {
        //     const guild = await client.guilds.fetch(serverId);
        //     const member = await guild.members.fetch(userId);
        //     member.send(" ort yul te bah")
        //     message.reply("sent")
        // } catch (ex) {
        //     message.reply(ex)
        // }
    },
};