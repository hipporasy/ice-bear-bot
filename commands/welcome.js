const { getUserFromMention } = require('../util/getUser')

module.exports = {
	name: 'welcome',
	description: 'Get information about a user.',
	execute(message, client) {
		const split = message.content.split(/ +/);
		const args = split.slice(1);
		const user = getUserFromMention(args[0], client);
		message.channel.send(`Welcome: ${user.username}, make yourself home`);
	}
};