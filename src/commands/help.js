const fs = require('fs');

exports.run = async function (client, msg, args) {

    if (!args[0]) {

        const commands = await fs.readdirSync('./commands/');
        // // let aliases  = require('../aliases.json');
        // delete require.cache[require.resolve('../aliases.json')];
        // aliases = Object.keys(aliases).map(a => `${a}${pad(10, a)}${aliases[a]}`).join('\n');

        msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: 'Help Comand',
            description: `I\'m a well design, stable music bot.\nDo \`${msg.channel.guild.prefix}help commandName\` for extended information on a command.\n\n**Looking for support?** https://discord.gg/wp2Z6yy`,
            fields: [
                { name: 'Music', value: '`play`, `pause`, `queue`, `resume`, `skip`, `stop`', inline: true },
                { name: 'Misc', value: '`ping`, `invite`', inline: false}
            ]
        }});

    } else {

        try {
            const cmd = require(`./${args[0]}.js`).usage;
            delete require.cache[require.resolve(`./${args[0]}.js`)];
            msg.channel.createMessage({ embed: {
                color: config.options.embedColour,
                title: `${cmd.main.replace('{command}', args[0].toLowerCase()).replace('{prefix}', msg.channel.guild.prefix)} ${cmd.args}`,
                fields: [
                     { name: 'Description', value: cmd.description },
                     { name: 'Arguments', value: cmd.args }
                ]
            }});
        } catch (err) {
            msg.channel.createMessage({ embed: {
                color: config.options.embedColour,
                title: 'Invalid command',
                description: 'Did you type the command correctly?'
            }});
        }

    }

};

function pad(ln, str) {
    return Array(ln - str.length).join(' ');
}

exports.usage = {
    main: '{prefix}{command}',
    args: '[command]',
    description: 'Shows commands and aliases.'
};
