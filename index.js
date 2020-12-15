const fs = require('fs')
const Discord = require('discord.js');
const Client = require('./client/Client');
const https = require('https');
var csv = require('csv-parser');
require('dotenv').config()
const BOT_PREFIX = process.env.BOT_PREFIX;
const BOT_TOKEN = process.env.BOT_TOKEN;

const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });
const trainnlp = require('./data/train-nlp');
const threshold = 0.5;
const path = require("path");
const modelPath = path.resolve('./model/model.nlp');
const trainedDataPath1 = path.resolve('./data/qatraining1.csv');
const trainedDataPath2 = path.resolve('./data/qatraining2.csv');
const trainedDataPath3 = path.resolve('./data/qatraining3.csv');
const unmatchedFile = path.resolve('./unmatched/data.txt');

const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

console.log(client.commands);

client.once('ready', async () => {
	console.log('Ready!');
	console.log('Starting');
	let jsonData = await parseCSV(trainedDataPath1);
	let jsonData1 = await parseCSV(trainedDataPath2);
	let jsonData2 = await parseCSV(trainedDataPath3);
	jsonData = jsonData.concat(jsonData1).concat(jsonData2);
	trainData(jsonData);
	console.log('Connected as: ');
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

client.on('message', async message => {

	if (message.channel.type === "dm") {
		if (message.author.bot) return;
		if (message.author.id != process.env.OWNER_ID) {
			try {
				const owner = client.users.cache.get(process.env.OWNER_ID)
				let content = message.content;
				let answer = await handleMessage(message, content);
				owner.send(`${message.author}: ${message}, Answer: ${answer}`)
			} catch (err) {
				console.log(err)
			}
			return
		} else {
			let content = message.content;
			await handleMessage(message, content);
		}
	}
	const args = message.content.slice(BOT_PREFIX.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command =
		client.commands.get(commandName) ||
		client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

	if (message.author.bot) return;
	if (message.mentions.has(client.user)) {
		let _message = message.content.split(" ")
		_message.shift()
		let content = _message.join(" ")
		await handleMessage(message, content);
		return
	}
	if (!message.content.startsWith(BOT_PREFIX)) return;

	try {
		if (commandName == "ban" || commandName == "userinfo" || commandName == 'send') {
			command.execute(message, client);
		} else {
			command.execute(message);
		}
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});


async function parseCSV(path) {
	const results = [];
	let readStream = fs.createReadStream(path);
	let readStreamPromise = new Promise((resolve, reject) => {
		readStream.pipe(csv())
			.on('data', (data) => results.push(data))
			.on('end', () => {
				resolve(results);
			})
			.on('error', () => reject);
	});
	return readStreamPromise;
}

async function trainData(jsonData) {

	const file = fs.createWriteStream("model.nlp", { encoding: 'utf8' });
	https.get('https://my-bucket-bot.s3-ap-southeast-1.amazonaws.com/model.nlp', (res) => {
		res.pipe(file)
		// console.log(file)
		// console.log('trained...');
		// try {
		// 	manager.load(file.path)
		// } catch (err) {
		// 	console.log(err)
		// }

		file.on('finish', function () {
			console.log('Training');
			manager.load(file.path)
			console.log('Well trained...');
			file.close();  // close() is async, call cb after close completes.
		});
	})
	// fs.access(modelPath, fs.constants.F_OK, (err) => {
	// 	if (err) {
	// 		console.log(err);
	// 		train(jsonData)
	// 	} else {
	// 		console.log('trained...');
	// 		manager.load(modelPath);
	// 	}
	// });
}

async function train(jsonData) {
	jsonData.forEach(function (obj) {
		if (obj.question !== undefined) {
			manager.addDocument('en', obj.question.toLowerCase(), obj.intent + obj.counter);
			manager.addAnswer('en', obj.intent + obj.counter, obj.answer.toLowerCase());
		}
	});
	await trainnlp(manager);
	console.log('Awaiting for training')
	const hrstart = process.hrtime();
	await manager.train();
	const hrend = process.hrtime(hrstart);
	console.info('Trained (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
	// fs.mkdir("/tmp", () => {
	// 	manager.save(modelPath);
	// })
}

async function handleMessage(e, message) {
	const response = await manager.process('en', message);
	const answer = response.score > threshold && response.answer ? response.answer : "Sorry, I don't know what do you mean";
	const unmatcheResponse = response.score < threshold ? `\nMessage : ${message} - response : ${answer}\n` : '';
	fs.appendFile(unmatchedFile, unmatcheResponse, function () { });
	e.reply(answer);
	return answer
}


client.login(BOT_TOKEN);