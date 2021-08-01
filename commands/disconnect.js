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
	 async execute(message, client){
		const split = message.content.split(/ +/);
		const args = split.slice(1);
		let guildMember = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0])) // Takes the user mentioned, or the ID of a user
		const user = getUserFromMention(args[0], client);
		const time = args[1];
		const guild = message.guild;
		var newDateObj = new Date(message.createdAt + time*60000);
		schedule.scheduleJob(newDateObj, () => {
			const voiceState = guildMember.voice;
			voiceState.kick();
			message.channel.send(`${user.username} has been disconnected!`);
		});
		message.channel.send(`Name: ${user.username} will disconnect in ${time} minutes`);
	}
};
