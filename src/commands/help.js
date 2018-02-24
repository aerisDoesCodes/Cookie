const fs = require('fs');

exports.run = async function (client, msg, args) {

    if(!msg.channel.permissionsOf(client.user.id).has('embedLinks')) return msg.channel.createMessage("I don't have `Send Embed` permission.\nPlease contact an administrator if you think this is a bug.");


    if (!args[0]) {

        const commands = await fs.readdirSync('./commands/');
        let aliases  = require('../aliases.json');
        delete require.cache[require.resolve('../aliases.json')];
        aliases = Object.keys(aliases).map(a => `${a}${pad(10, a)}${aliases[a]}`).join('\n');

        msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: 'Help Comand',
            description: `I\'m a well designed bot.\nDo \`${msg.channel.guild.prefix}help commandName\` for extended information on a command.\n\n**Looking for support?** https://discord.gg/DP9949T\n**Donate if you like Cookie** https://www.paypal.me/JohnLoveCookies`,
            fields: [
                { name: 'Developer', value: '`eval`, `restart`, `dev`', inline: true },
                { name: 'Admin', value: '`prefix`' },
                { name: 'Misc', value: '`ping`, `invite`, `stats`, `about`', inline: false},
                { name: 'Nsfw', value: '`boobs`', inline: false}
            ]
        }});

    } else {

        try {
            const cmd = require(`./${args[0]}.js`).usage;
            delete require.cache[require.resolve(`./${args[0]}.js`)];
            msg.channel.createMessage({ embed: {
                color: config.options.embedColour,
                title: `${cmd.main.replace('{command}', args[0].toLowerCase()).replace('{prefix}', msg.channel.guild.prefix)}`,
                description: cmd.description,
                fields: [
                    { name: 'Arguments', value: cmd.argss || "None", inline: false}
                ]
            }});
        } catch (err) {
            msg.channel.createMessage({ embed: {
                color: config.options.embedColour,
                title: 'Invalid command',
                description: `${err}`
            }});
        }

    }

};

function pad(ln, str) {
    return Array(ln - str.length).join(' ');
}

exports.usage = {
    main: '{prefix}{command}',
    argss: '[command]',
    description: 'Shows commands and aliases.'
};
