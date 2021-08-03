const { getUserFromMention } = require('../util/getUser')
const Discord = require('discord.js');
const schedule = require('node-schedule');
const dayjs = require('dayjs');

const availableUser = [
	'820193667599302676', 
	'746992790352822274',
	'855325729809367040',
	'718058156999180348',
	'175196751131705344',
	'757616096550322247'
];

module.exports = {
	name: 'disconnect',
	aliases: ['d', 'dc'],
	description: 'Schedule Disconnect!',
	/**
 	*
 	* @param {Discord.Message} 
 	* @param {Discord.Client}
 	*/
	 async execute(message, client) {
		if (message.author.id != process.env.OWNER_ID && !availableUser.includes(message.author.id.toString())) { 
			message.channel.send(`Ort ban teh bro XD`);
			return;
		}
		const split = message.content.split(/ +/);
		const args = split.slice(1);
		let guildMember = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0])) // Takes the user mentioned, or the ID of a user
		const user = getUserFromMention(args[0], client);
		const time = args[1];
		if (!time) {
			const voiceState = guildMember.voice;
			if (voiceState	) {
				voiceState.kick();
				message.channel.send(`${user.username} has been disconnected!`);
				return;
			}
			message.channel.send('User not in Channel');
			return;
		}
		var newDateObj = dayjs().add(time, 'minute').toDate();
		schedule.scheduleJob(newDateObj, () => {
			const voiceState = guildMember.voice;
			if (voiceState) {
				voiceState.kick();
				message.channel.send(`${user.username} has been disconnected!`);
				return;
			}
			message.channel.send('User not in Channel');
		});
		message.channel.send(`Name: ${user.username} will disconnect in ${time} minutes`);
	}
};
