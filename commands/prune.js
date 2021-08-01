module.exports = {
	name: 'prune',
	description: 'Delete the last messages in all chats.',
	async execute(message) {
		
		const args = message.content.split(' ');
		
		let guildMember = message.guild.member(message.author);
		if (!guildMember.hasPermission('ADMINISTRATOR') && !guildMember.hasPermission('MANAGE_MESSAGES') && message.author.id != process.env.OWNER_ID) {
			message.reply('somtos bart! tver ort ban teh');
			return;
		}
		let deleteCount = 0;
		try {
			deleteCount = parseInt(args[1], 10);
		} catch (err) {s
			return message.reply('Please provide the number of messages to delete. (max 100)')
		}

		if (!deleteCount || deleteCount < 2 || deleteCount > 100)
			return message.reply('Please provide a number between 2 and 100 for the number of messages to delete');

		const fetched = await message.channel.messages.fetch({
			limit: deleteCount,
		});
		message.channel.bulkDelete(fetched)
			.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
	},
};