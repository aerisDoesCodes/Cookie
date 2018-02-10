exports.run = function (client, msg, args) {

    const moment = require('moment');
    require('moment-duration-format');
    const duration = moment.duration(client.uptime).format(' d [d], h [h], m [m], s [s]');

        msg.channel.createMessage({embed:{
            title: `Cookie v${config.version}`,
            description: `**Coded by aeris#0018**`,
            color: config.options.embedColour,
            fields: [
                { name: 'Uptime', value: duration, inline: true},
                { name: 'RAM Usage', value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`, inline: true },
                { name: 'Library', value: '[Eris](http://npmjs.com/package/eris)', inline: true },
                { name: 'Guilds', value: client.guilds.size, inline: true },
                { name: 'Users', value: client.users.size, inline: true },
                { name: 'Latency', value: `${msg.channel.guild.shard.latency}ms`, inline: true }
            ]
        }});
    
    };
    
    exports.usage = {
        main: '{prefix}{command}',
        description: 'View statistics of the bot.'
    };
    