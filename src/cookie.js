global.config = require('./config.json');

const extras = require('../util/extras.js');
const sf     = require('snekfetch');
const mCol   = require('../util/messageCollector.js');
const Eris   = require('../util/extensionLoader.js')(require('eris'));
const request = require('request')
const snekfetch = require('snekfetch')
const dbl = require("dblposter");

// Then, depending on what you called your client


const client = new Eris.Client(config.keys.discord, {
    disableEvents: extras.disable('GUILD_BAN_ADD', 'GUILD_BAN_REMOVE', 'MESSAGE_DELETE', 'MESSAGE_DELETE_BULK', 'MESSAGE_UPDATE', 'PRESENCE_UPDATE', 'TYPING_START', 'USER_UPDATE'),
    messageLimit: 0,
    maxShards: config.options.shards
});

client.messageCollector = new mCol(client);

Object.defineProperty(Eris.TextChannel.prototype, 'awaitMessages', {
    async value(predicate, options = {}) {
        return await client.messageCollector.awaitMessages(predicate, options, this.id);
    }
});


let prefix = config.prefix
// global.prefixes = require('./prefixes.json');
const DBLPoster = new dbl(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQxMTUzODk3MzY2NDYwODI1NyIsImJvdCI6dHJ1ZSwiaWF0IjoxNTE5NzEyODE5fQ.IKJXAx-SR6_Upx4VhR2UKuODAh5yuu3sisXiXpBXuUw`, client);


client.on('ready', async () => {
    console.log(`Ready! (User: ${client.user.username})`);
    client.editStatus('online', { name: `${config.prefix}help || ${client.guilds.size} servers!` });
    DBLPoster.bind();
});

client.on('guildCreate', async (g) => {
});

client.on('guildDelete', async (g) => {
});

client.on('messageCreate', async (msg) => {
    if (msg.isFromDM || msg.author.bot || !msg.content.startsWith(prefix)) return;
    
    let command = msg.content.slice(prefix.length).toLowerCase().split(/\s+/)[0];
    const args  = msg.content.split(" ").splice(1);

    /* Extras */
    // msg.channel.guild.prefix = prefixes[msg.channel.guild.id];

    delete require.cache[require.resolve('./aliases.json')];
    const aliases = require('./aliases.json');
    if (aliases[command]) command = aliases[command];

    try {
        delete require.cache[require.resolve(`./commands/${command}`)];
        require(`./commands/${command}`).run(client, msg, args);
    } catch(e) {
        if (e.message.includes('Cannot find module') || e.message.includes('ENOENT')) return;
        msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: `${command} failed`,
            description: 'The command failed to run. The error has been logged.'
        }});
        console.error(`[ERROR] ${e.message}\n${e.stack.split('\n')[0]}\n${e.stack.split('\n')[1]}`);
    }
});

client.connect();