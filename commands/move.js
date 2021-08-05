const availableUser = [
	'820193667599302676', 
	'746992790352822274',
	'855325729809367040',
	'718058156999180348',
	'175196751131705344',
	'757616096550322247',
	'653608846731771935'
];

module.exports = {
	name: 'move',
	aliases: ['mv', 'mv'],
	description: 'Move!',
	/**
	*
	* @param {Discord.Message} 
	* @param {Discord.Client}
	*/
	async execute(message, client) {
		if (message.author.id != process.env.OWNER_ID && availableUser.includes(message.author.id)) { 
			message.channel.send(`Ort jong!`);
			return;
		}
		const split = message.content.split(/ +/);
		const args = split.slice(1);
		let guildMember = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0])) // Takes the user mentioned, or the ID of a user
		const channelId = args[1];
		if (!channelId) { 
			message.channel.send(`Channel is missing`);
		}
		guildMember.voice.setChannel(channelId)
		.then(() => console.log(`Moved ${guildMember.displayName} to ${channelId}`))
		.catch(console.error);
	}
};
