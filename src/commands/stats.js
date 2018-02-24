exports.run = function (client, msg, args) {

    const moment = require('moment');
    require('moment-duration-format');
    const duration = moment.duration(client.uptime).format(' d [d], h [h], m [m], s [s]');

    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if(bytes === 0) return 'n/a';
        var by = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if(by === 0) return `${bytes} ${sizes[by]}`;
        return `${(bytes / Math.pow(1024, by)).toFixed(1)} ${sizes[by]}`;
    }
    if(!msg.channel.permissionsOf(client.user.id).has('embedLinks')) return msg.channel.createMessage("I don't have `Send Embed` permission.\nPlease contact an administrator if you think this is a bug.");

try {
        msg.channel.createMessage({embed:{
            title: `Cookie v${config.version}`,
            color: config.options.embedColour,
            fields: [
                { name: 'Uptime', value: duration, inline: true},
                { name: 'Memory', value: `${bytesToSize(process.memoryUsage().rss)}/${bytesToSize(require('os').totalmem())}`, inline: true },
                { name: 'Library', value: '[Eris](http://npmjs.com/package/eris)', inline: true },
                { name: 'Guilds', value: client.guilds.size, inline: true },
                { name: 'Users', value: client.users.size, inline: true },
                { name: 'Latency', value: `${msg.channel.guild.shard.latency}ms`, inline: true }
            ]
        }});
    } catch(e){
        msg.channel.createMessage(`An error occured:\n**${e}**\n\nPlease report this to the administrator if you think this is a bug.`)
    }
    };
    
    exports.usage = {
        main: '{prefix}{command}',
        description: 'View statistics of the bot.'
    };
    