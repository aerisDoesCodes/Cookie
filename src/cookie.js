global.config = require('./config.json');

const extras = require('../util/extras.js');
const sf     = require('snekfetch');
const mCol   = require('../util/messageCollector.js');
const Eris   = require('../util/extensionLoader.js')(require('eris'));

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

client.on('ready', async () => {
    console.log(`Ready! (User: ${client.user.username})`);
    client.editStatus('online', { name: `${config.prefix}help || ${client.guilds.size} servers!` });

    
});

client.on('guildCreate', async (g) => {
    if (g.members.filter(m => m.bot).length / g.members.size >= 0.60)
        return g.leave();

    // prefixes[g.id] = config.options.prefix;
    

    if (!config.botlists) return;

    for (const list of config.botlists)
        await sf.post(list.url.replace(':id', client.user.id)).send({ 'server_count': client.guilds.size }).set('Authorization', list.token);
});

client.on('guildDelete', async (g) => {
    // delete prefixes[g.id];
    

    if (!config.botlists) return;

    for (const list of config.botlists)
        await sf.post(list.url.replace(':id', client.user.id)).send({ 'server_count': client.guilds.size }).set('Authorization', list.token);
});

client.on('messageCreate', async (msg) => {
    if (msg.isFromDM || msg.author.bot ) return;

    if (msg.mentions.find(m => m.id === client.user.id) && msg.content.toLowerCase().includes('help'))
        return msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: `Use c!help for commands`
        }});

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