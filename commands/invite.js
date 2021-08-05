module.exports = {
    name: "invite",
    aliases: ["discord", "inv"],
    cooldown: 10,
    description: "Show the bot's average ping",
    execute(message) {
        message.reply(`discord.gg/EzRfJVV`).catch(console.error);
    }
};