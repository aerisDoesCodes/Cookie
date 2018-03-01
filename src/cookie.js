global.config = require('./config.json');

const extras = require('../util/extras.js');
const sf     = require('snekfetch');
const mCol   = require('../util/messageCollector.js');
const Eris   = require('../util/extensionLoader.js')(require('eris'));
const request = require('request')
const dbl = require("dblposter");
var dbotsKey = "e4f476451d22298a3f7f0c942422097ea61edb0682f66e153e29e77dedf7fd422a11afe51b0644a08bf8e58a7d2737d135bf22f78fcc29dfcbd10c2b5e4522b2";

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
    client.editStatus('online', { name: `${config.prefix}help || ${client.guilds.size} servers!` });
    client.createMessage('418050045783572481', {embed:{
        color: 0x00ff00,
        title:`Joined Server`,
        fields:[
        {name:`Name`,value: g.name, inline: true},
        {name:`Owner`,value: `${g.members.get(g.ownerID).username}#${g.members.get(g.ownerID).discriminator}`, inline: true}
    ]
    }})
        DBLPoster.bind();
});

client.on('guildDelete', async (g) => {
    client.editStatus('online', { name: `${config.prefix}help || ${client.guilds.size} servers!` });
    client.createMessage('418050045783572481', {embed:{
        color: 0xFF0000,
        title:`Left Server`,
        fields:[
        {name:`Name`,value: g.name, inline: true},
        {name:`Owner`,value: `${g.members.get(g.ownerID).username}#${g.members.get(g.ownerID).discriminator}`, inline: true}
    ]
    }})
        DBLPoster.bind();
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
