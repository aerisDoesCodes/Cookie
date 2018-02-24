exports.run = function(client, msg, args) {
    const moment = require('moment');
    require('moment-duration-format');
    
    const duration = moment.duration(client.uptime).format(' d [d], h [h], m [m], s [s]');
    
    function bytesToSize(bytes) {
        let sizeTypes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        let by = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
        if(!bytes || bytes == 0) return 'N/A';
        if(!by || by == 0) return `${bytes} ${sizeTypes[by]}`;
        
        return `${(bytes / Math.pow(1024, by)).toFixed(1)} ${sizeTypes[by]}`;
    }
    
    try {
        msg.channel.createMessage({embed: {
            title: `Cookie - v${config.version}`,
            color: config.options.embedColour,
            fields: [
                { name: 'Bot uptime', value: duration, inline: true },
                { name: 'Memory usage', value: `${bytesToSize(process.memeoryUsage().rss)}/${bytesToSize(require('os').totalmem())}`, inline: true },
                { name: 'API library', value: '[Eris](https://www.npmjs.com/package/eris)', inline: true },
                { name: 'Total guilds', value: `${client.guilds.size}`, inline: true },
                { name: 'Total users', value: `${client.users.size}`, inline: true },
                { name: 'Ping latency', value: `${msg.channel.guild.shard.latency}ms`, inline: true }
            ]
        }});
    } catch(e) {
        msg.channel.createMessage(`An error occurred!\n\n**${e}**\n\nIf you think this is a bug, report to an administrator+ on the official server.`)
    }
}
    
exports.usage = {
    main: '{prefix}{command}',
    description: 'View bot statistics'
}   
