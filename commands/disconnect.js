const { getUserFromMention } = require('../util/getUser')
const Discord = require('discord.js');
const schedule = require('node-schedule');
module.exports = {
	name: 'disconnect',
	aliases: ['d', 'dc'],
	description: 'Schedule Disconnect!',
	/**
 	*
 	* @param {Discord.Message} 
 	* @param {Discord.Client}
 	*/
	execute(message, client) {
		const split = message.content.split(/ +/);
		const args = split.slice(1);
		const mentionUsers = message.mentions.users.first()
		const user = getUserFromMention(args[0], client);
		const time = args[1];
		const guild = message.guild;
		var newDateObj = new Date(message.createdAt + time*60000);
		schedule.scheduleJob(newDateObj, async () => {
			const guildMember = await guild.fetch(user);
			const voiceState = guildMember.voice;
			console.log(guildMember);
			voiceState.setChannel(null);
			message.channel.send(`${user.username} has been disconnected!`);
		});
		message.channel.send(`Name: ${user.username} will disconnect in ${time} minutes`);
	}
};
